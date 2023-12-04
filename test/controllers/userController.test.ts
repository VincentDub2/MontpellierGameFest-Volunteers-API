// tests/userController.test.ts

import userController from "../../src/controllers/userController";
import userService from "../../src/services/user.service";

// Ici, nous castons explicitement la fonction en jest.Mock
const mockVerifyEmail = userService.verifyEmail as jest.Mock;

import { createRequest, createResponse } from 'node-mocks-http';


jest.mock('../../src/services/user.service');
jest.mock('../../src/helpers/loggers');

describe('userController', () => {
    describe('verifyEmail', () => {
        it('should verify email successfully', async () => {
            const req = createRequest({
                query: { token: 'valid-token' }
            });
            const res = createResponse();

            await userController.verifyEmail(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ message: "Email vérifié avec succès." });
            expect(userService.verifyEmail).toHaveBeenCalledWith('valid-token');
        });

        it('should return error for invalid token', async () => {
            const req = createRequest({
                query: { token: '' } // ou null
            });
            const res = createResponse();

            await userController.verifyEmail(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({ message: "Token invalide" });
        });


        it('should handle service errors', async () => {
            mockVerifyEmail.mockRejectedValue(new Error('Service error'));
            const req = createRequest({
                query: { token: 'valid-token' }
            });
            const res = createResponse();

            await userController.verifyEmail(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({ message: "Échec de la vérification de l'email: Error: Service error" });
        });
    });

    describe('getCurrentUser', () => {
        it('should retrieve current user', async () => {
            const user = { id: '123', email: 'user@example.com' };
            const req = createRequest({
                user: user
            });
            const res = createResponse();

            await userController.getCurrentUser(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(user);
        });

        it('should return error if user is not authenticated', async () => {
            const req = createRequest();
            const res = createResponse();

            await userController.getCurrentUser(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({ message: "Erreur lors de la récupération de l'utilisateur" });
        });
    });
});
