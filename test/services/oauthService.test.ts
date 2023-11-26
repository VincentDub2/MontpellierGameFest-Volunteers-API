// test/oauthService.test.ts

import axios from 'axios';
import prisma from '../../src/prisma';
import mocked = jest.mocked;
import oauthService, {
    exchangeCodeForAccessToken,
    fetchUserProfile,
    findOrCreateUser,
    UserProfile
} from "../../src/services/oauth.service";
import {User} from "@prisma/client";

jest.mock('axios');

import { PrismaClient } from '@prisma/client';
jest.mock('../../src/prisma', () => {
    return {
        __esModule: true,
        default: {
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
            },
        },
    };
});

// Importez ensuite les fonctions mock directement pour les utiliser dans vos tests
// Maintenant, prisma est un mock et prisma.user a des méthodes mockées
const prismaMock = require('../../src/prisma').default;

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
        mocked(axios.post).mockResolvedValue({ data: { access_token: 'fake_token' } });

        const token = await exchangeCodeForAccessToken('google', 'fake_code');
        expect(token).toBe('fake_token');
    });

    it('should throw an error for unsupported provider', async () => {
        await expect(exchangeCodeForAccessToken('unknown_provider', 'fake_code')).rejects.toThrow('Fournisseur OAuth non pris en charge');
    });
});

describe('fetchUserProfile', () => {
    it('should fetch user profile from Google', async () => {
        const fakeProfile = { email: 'test@example.com', name: 'Test User' };
        mocked(axios.get).mockResolvedValue({ data: fakeProfile });

        const profile = await fetchUserProfile('google', 'fake_token');
        expect(profile).toEqual(fakeProfile);
    });

    it('should throw an error for unsupported provider', async () => {
        await expect(fetchUserProfile('unknown_provider', 'fake_token')).rejects.toThrow('Fournisseur OAuth non pris en charge');
    });
});

describe('findOrCreateUser', () => {
    const fakeUserProfile: UserProfile = {
        email: 'test@example.com',
        name: 'Test User',
        providerId: 'google',
        providerUserId: 'google-id',
        accessToken: 'fake_token',
    };

    it('should find existing user', async () => {
        prismaMock.user.findUnique.mockResolvedValueOnce(fakeUserProfile as unknown as User);

        const result = await findOrCreateUser(fakeUserProfile);
        expect(result).toEqual(fakeUserProfile);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: fakeUserProfile.email } });
        expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
    it('should create new user if not found', async () => {
        prismaMock.user.findUnique.mockResolvedValueOnce(null); // Simuler qu'aucun utilisateur n'existe
        prismaMock.user.create.mockResolvedValueOnce(fakeUserProfile as unknown as User); // Simuler la création d'un utilisateur

        const result = await findOrCreateUser(fakeUserProfile);
        expect(result).toEqual(fakeUserProfile);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: fakeUserProfile.email } });
        expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: {
                email: fakeUserProfile.email,
                name: fakeUserProfile.name,
                // Autres champs nécessaires pour la création d'un utilisateur
                OAuthAccount: {
                    create: {
                        providerId: fakeUserProfile.providerId,
                        provider: fakeUserProfile.providerId, // 'google' dans ce cas
                        providerUserId: fakeUserProfile.providerUserId,
                        accessToken: fakeUserProfile.accessToken,
                        // refreshToken si nécessaire
                    },
                },
            },
        });
    });
});

