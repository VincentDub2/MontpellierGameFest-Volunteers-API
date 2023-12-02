import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import * as process from "process";
import mailHelpers from "../helpers/mailHelpers";

const UserService = {
    // Créer un nouvel utilisateur
    createUser: async (email: string, name: string) => {

        const emailVerificationToken = uuidv4(); // Générer un token unique

        const user = await prisma.user.create({
            data: {
                email,
                name,
                emailVerificationToken
            }
        });
        const link = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

        // Envoyer un email de vérification
        await mailHelpers.sendEmailVerification(email, link);
        return user;
    },

    // Trouver un utilisateur par email
    findUserByEmail: async (email: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { authLocal: true, authOAuth: true }
        });

        return user;
    },

    // Mise à jour du profil de l'utilisateur
    updateUser: async (userId: string, updateData: { name?: string, email?: string }) => {
        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return user;
    },
    // Vérifier l'email de l'utilisateur
    verifyEmail: async (token: string) => {
        const user = await prisma.user.findFirst({
            where: { emailVerificationToken: token }
        });

        if (!user) {
            throw new Error('Token de vérification invalide');
        }



        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true, emailVerificationToken: null }
        });

        return user;
    },
    // Trouver un utilisateur par ID
    findUserById: async (userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        return user;
    },
    findUserByIdWithAuth: async (userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { authLocal: true, authOAuth: true }
        });

        return user;
    },
    getUsersFailedAttempts: async (userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { authLocal: true }
        });
        return user?.authLocal?.failedAttempts;
    }
};
export default UserService;
