// test/oauthService.test.ts

import axios from 'axios';
import prisma from '../../src/prisma';
import { oauthService, exchangeCodeForAccessToken, fetchUserProfile, findOrCreateUser, UserProfile } from "../../src/services/oauth.service";
import {User} from "@prisma/client";
import {stringify} from "ts-jest";



jest.mock('axios');
// Créer un mock pour le client Prisma
jest.mock('../../src/prisma', () => {
    return {
        __esModule: true,
        default: {
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
                // Ajoutez d'autres méthodes mockées si nécessaire
            },
            // Mockez d'autres modèles de Prisma si nécessaire
        },
    };
});

// Maintenant, vous pouvez utiliser prismaMock pour vos tests


const prismaMock = jest.mocked(prisma, { shallow: false});
const axiosMocked = jest.mocked(axios, { shallow: false});

describe('oauthService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getRedirectUrl', () => {
        it('should return the correct URL for Google', async () => {
            process.env.GOOGLE_CLIENT_ID = 'test_client_id';
            process.env.GOOGLE_REDIRECT_URI = 'http://localhost/callback';

            const url = await oauthService.getRedirectUrl('google');
            expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
            expect(url).toContain('response_type=code');
            expect(url).toContain('client_id=test_client_id');
            expect(url).toContain('redirect_uri=http://localhost/callback');
        });

        it('should throw an error for unsupported provider', async () => {
            await expect(oauthService.getRedirectUrl('unknown_provider')).rejects.toThrow('Fournisseur OAuth non pris en charge');
        });
    });

    describe('exchangeCodeForAccessToken', () => {
        it('should exchange code for access token', async () => {
            axiosMocked.post.mockResolvedValue({ data: { access_token: 'fake_token' } });

            const token = await exchangeCodeForAccessToken('google', 'fake_code');
            expect(token.access_token).toBe('fake_token');
        });

        it('should throw an error for unsupported provider', async () => {
            await expect(exchangeCodeForAccessToken('unknown_provider', 'fake_code')).rejects.toThrow('Fournisseur OAuth non pris en charge');
        });
    });

    describe('fetchUserProfile', () => {
        it('should fetch user profile from Google', async () => {
            const fakeGoogleProfile = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
            };
            axiosMocked.get.mockResolvedValue({ data: fakeGoogleProfile });

            const profile = await fetchUserProfile('google', 'fake_token');
            expect(profile).toEqual({
                email: fakeGoogleProfile.email,
                name: fakeGoogleProfile.name,
                provider: 'google',
                providerId: 'google',
                providerUserId: stringify(1),
            });
        });

        it('should throw an error for unsupported provider', async () => {
            await expect(fetchUserProfile('unknown_provider', 'fake_token')).rejects.toThrow('Fournisseur OAuth non pris en charge');
        });
    });

    describe('findOrCreateUser', () => {
        const fakeUserProfile: UserProfile = {
            email: 'test@example.com',
            name: 'Test User',
            provider: 'google',
            providerId: 'google',
            providerUserId: stringify(1),
        };

        const fakeToken = {
            access_token: "fake_access_token",
            expires_in: 3600,
            refresh_token: "fake_refresh_token",
            scope: "email",
            token_type: "Bearer",
            id_token: "fake_id_token"
        };

        it('should find existing user', async () => {
            prismaMock.user.findUnique.mockResolvedValue(fakeUserProfile as unknown as User);

            const result = await findOrCreateUser(fakeUserProfile, fakeToken);
            expect(result).toEqual(fakeUserProfile);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: fakeUserProfile.email } });
            expect(prismaMock.user.create).not.toHaveBeenCalled();
        });

        it('should create new user if not found', async () => {
            prismaMock.user.findUnique.mockResolvedValueOnce(null);
            prismaMock.user.create.mockResolvedValueOnce(fakeUserProfile as unknown as User);

            const result = await findOrCreateUser(fakeUserProfile, fakeToken);
            expect(result).toEqual(fakeUserProfile);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: fakeUserProfile.email } });
            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    email: fakeUserProfile.email,
                    name: fakeUserProfile.name,
                    emailVerified: true,
                    authOAuth: {
                        create: {
                            providerId: 'google',
                            provider: 'google',
                            providerUserId: fakeUserProfile.providerUserId,
                            accessToken: fakeToken.access_token,
                            refreshToken: fakeToken.refresh_token,
                        },
                    },
                },
            });
        });
    });
});
