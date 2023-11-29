import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import * as process from "process";


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

        sendEmailVerification(email, emailVerificationToken);
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
    ,sendEmailWelcome: async (email: string) => {
            // Envoyer un email de vérification
            try{
                console.log("GMAIL_USER ",process.env.GMAIL_USER);
                console.log("GMAIL_PASSWORD ",process.env.GMAIL_PASSWORD);
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD
                    }
                });
                await transporter.sendMail({
                    from: 'ur@gmail.com',
                    to: email,
                    subject: 'Bienvenue',
                    text: `Bienvenue sur notre site`
                }
                );
    }catch(error){
        console.log(error);
    }}
    ,sendEmailBlockAccount: async (email: string) => {
        // Envoyer un email de vérification
        try{
            console.log("GMAIL_USER ",process.env.GMAIL_USER);
            console.log("GMAIL_PASSWORD ",process.env.GMAIL_PASSWORD);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
            await transporter.sendMail({
                from: 'test@gmail.com',
                to: email,
                subject: 'Compte bloqué',
                text: `Votre compte a été bloqué`
            },
            );
    }catch (error){
        console.log(error);
    }}
};



const sendEmailVerification = async (email: string, emailVerificationToken: string) => {

    // Envoyer un email de vérification
    try{
        console.log("GMAIL_USER ",process.env.GMAIL_USER);
        console.log("GMAIL_PASSWORD ",process.env.GMAIL_PASSWORD);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
            }
        });
        await transporter.sendMail({
            from: 'your-email@example.com',
            to: email,
            subject: 'Vérification de votre email',
            text: `Veuillez cliquer sur ce lien pour vérifier votre email: ${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
        });
    }catch(error){
        console.log(error);
    }
}

export default UserService;
