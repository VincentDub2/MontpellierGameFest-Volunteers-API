// test/oauthController.test.ts
import supertest from 'supertest';
import app from '../../src/index'; // Assurez-vous que le chemin d'accès est correct

describe('OAuth Controller', () => {
    describe('redirectToProvider', () => {
        it('should redirect to OAuth provider', async () => {
            const response = await supertest(app).get('/auth/google');
            expect(response.status).toBe(302);
        });
    });

    describe('handleProviderCallback', () => {
        it('should handle the provider callback', async () => {
            const fakeCode = '12345';
            const response = await supertest(app).get(`/auth/google/callback?code=${fakeCode}`);
            expect(response.status).toBe(302);
        });
    });
});
