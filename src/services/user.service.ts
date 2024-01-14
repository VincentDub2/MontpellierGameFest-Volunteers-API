import prisma from '../prisma';
import {v4 as uuidv4} from 'uuid';
import * as process from "process";
import mailHelpers from "../helpers/mailHelpers";
import {logger} from "../helpers/loggers.vercel";

import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


type UploadResult = {
    secure_url: string;
    public_id: string;
};


const UserService = {
    // Créer un nouvel utilisateur
    /**
     * Cette methode permet de créer un nouvel utilisateur
     * @param email
     * @param firstName
     * @param address
     * @param lastName
     */
    createUser: async (email: string, firstName: string,address : string,lastName : string) => {

        const emailVerificationToken = uuidv4(); // Générer un token unique

        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                address,
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
        return await prisma.user.findUnique({
            where: {email},
            include: {authLocal: true, authOAuth: true}
        });
    },

    // Mise à jour du profil de l'utilisateur
    updateUser: async (userId: string, updateData: { name?: string, email?: string }) => {
        return await prisma.user.update({
            where: {id: userId},
            data: updateData
        });
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
    /**
     * Cette methode permet de mettre à jour le nombre d'essais de connexion ratés
     * @param userId
     */
    getUsersFailedAttempts: async (userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { authLocal: true }
        });
        return user?.authLocal?.failedAttempts;
    },
    /**
     * Cette methode permet d'upload une image de profil sur cloudinary
     * @param file
     */
    uploadProfilePicture: async (file: Buffer): Promise<UploadResult | undefined> => {
        try {
            const uploadResult = await new Promise<UploadResult>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else if (!result) {
                            reject(new Error("Erreur de résultat d'upload indéfini"));
                        } else {
                            resolve(result);
                        }
                    }
                );

                uploadStream.end(file);
            });
            logger.info(`Image de profil uploadée avec succès: ${uploadResult.secure_url}`);
            return uploadResult;
        } catch (error) {
            logger.error(`Erreur lors de l'upload de l'image de profil: ${error}`)
            return undefined;
        }
    },
    /**
     * Cette methode permet de mettre à jour l'image de profil d'un utilisateur
     * @param userId
     * @param picture
     * @param publicId
     */
    setPictureProfile: async (userId: string, picture: string, publicId : string) => {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { picture ,pictureId : publicId}
        });
        return user;
    },
    /**
     * Cette methode permet de supprimer l'image de profil d'un utilisateur
     * @param publicId
     */
    deleteProfilePicture : async (publicId: string): Promise<void> => {
        try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Image supprimée avec succès: ${publicId}`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'image: ${error}`);
        }
    }
};
export default UserService;
