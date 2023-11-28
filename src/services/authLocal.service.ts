import axios from 'axios';
import prisma from '../prisma';
import bcrypt from "bcrypt";

const AuthLocalService = {
    // (Les fonctions existantes)
    verifyPassword: async (password: string, hashedPassword: string, salt: string) => {
        const hash = await bcrypt.hash(password, salt);
        return hash === hashedPassword;
    },

    // Créer un token de réinitialisation de mot de passe
    createPasswordResetToken: async (userId: string, token: string, expiresAt: Date) => {
        const passwordResetToken = await prisma.passwordResetToken.create({
            data: {
                userId,
                token,
                expiresAt
            }
        });

        return passwordResetToken;
    },

    // Vérifier le token de réinitialisation de mot de passe
    verifyPasswordResetToken: async (token: string) => {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true }
        });

        // Vérifiez également si le token a expiré
        const isTokenValid = passwordResetToken && passwordResetToken.expiresAt > new Date();

        return {
            valid: isTokenValid,
            user: isTokenValid ? passwordResetToken.user : null
        };
    },

    // Méthode pour hacher le mot de passe (pourrait être utilisée lors de la création de l'utilisateur)
    hashPassword: async (password: string) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },

    // Méthode pour ajouter des informations AuthLocal à un utilisateur existant
    addAuthLocalToUser: async (userId: string, password: string, salt: string) => {
        const hashedPassword = await bcrypt.hash(password, salt);
        const authLocal = await prisma.authLocal.create({
            data: {
                userId,
                hashedPassword,
                salt
            }
        });

        return authLocal;
    },
    updateFailedAttempts: async (userId: string, failedAttempts: number) => {
        const authLocal = await prisma.authLocal.update({
            where: { userId },
            data: { failedAttempts }
        });
        return authLocal;
    },
    blockUser: async (userId: string,date : Date) => {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { authLocal: { update: { lockUntil : date } } }
        });
        return user;
    },resetUserLock: async (userId: string) => {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { authLocal: { update: { lockUntil : null } } }
        });
        return user;
    }
};

export default AuthLocalService;
