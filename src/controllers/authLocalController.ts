import {Request, Response} from "express";
import userService from "../services/user.service";
import authLocalService from "../services/authLocal.service";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import {logger} from "../helpers/loggers.vercel";


//Permet de générer un token unique
import {v4 as uuidv4} from "uuid";

//Permet d'envoyer des mails
import mailService from "../helpers/mailHelpers";


const MAX_ATTEMPTS = 5; // Nombre maximal de tentatives
const LOCK_TIME = 2 * 60 * 60 * 1000; // Temps de blocage (par exemple, 2 heures)

const authLocalController = {
    login: async (req: Request, res: Response) => {
        try {
            // Récupérer l'email et le mot de passe de la requête
            const { email, password } = req.body;

            // Vérifier si l'email et le mot de passe sont présents
            if (!email || !password) {
                logger.warn("Tentative de connexion sans email ou mot de passe");
                return res.status(400).json({ message: "Email et mot de passe requis" });
            }

            // On récupère l'utilisateur s'il existe
            const user = await userService.findUserByEmail(email);

            // Si l'utilisateur n'existe pas ou n'a pas de mot de passe local
            if (!user || !user.authLocal) {
                logger.warn(`Tentative de connexion avec un utilisateur inexistant: ${email}`);
                return res.status(400).json({ message: "Utilisateur introuvable" });
            }

            // Vérifier si l'utilisateur est verrouillé
            if (user.authLocal.lockUntil && user.authLocal.lockUntil > new Date()) {
                logger.warn(`Tentative de connexion avec un utilisateur verrouillé: ${email}`);
                return res.status(400).json({ message: "Le compte est verrouillé. Veuillez réessayer plus tard" });
            }

            // Vérifier si le mot de passe est valide
            const isPasswordValid = await authLocalService.verifyPassword(password,user.authLocal.hashedPassword, user.authLocal.salt);

            // Si le mot de passe n'est pas valide
            if (!isPasswordValid) {
                // Incrémenter le nombre de tentatives échouées
                await authLocalService.updateFailedAttempts(user.id, user.authLocal.failedAttempts + 1);
                logger.warn(`Tentative de connexion avec un mot de passe incorrect pour l'utilisateur: ${user.id}`);
                if (user.authLocal.failedAttempts + 1 >= MAX_ATTEMPTS) {
                    // Si le nombre de tentatives échouées est supérieur ou égal au nombre maximal de tentatives
                    logger.warn(`L'utilisateur: ${user.id} a dépassé le nombre maximal de tentatives de connexion. Verrouillage du compte`);
                    // Bloquer l'utilisateur pendant le "LOCK_TIME"
                    await authLocalService.blockUser(user.id, new Date(Date.now() + LOCK_TIME));

                    // Envoyer un email à l'utilisateur pour l'informer que son compte a été verrouillé
                    await mailService.sendAccountBlockedEmail(user.email);
                    return res.status(400).json({ message: "Le compte est verrouillé. Veuillez réessayer plus tard" });
                }
                return res.status(400).json({ message: "Mot de passe incorrect" });
            }

            // Vérifie si les variables d'environnement sont bien présentes
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET manquant dans le fichier .env');
            }
            // Générer un token JWT
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // Réinitialiser le nombre de tentatives échouées
            await authLocalService.updateFailedAttempts(user.id, 0);

            // Réinitialiser le verrouillage de l'utilisateur
            await authLocalService.resetUserLock(user.id);

            logger.info(`Utilisateur connecté avec succès avec l'ID: ${user.id}`);
            res.status(200).json({ token }); // Envoyer le token à l'utilisateur
        } catch (error) {
            logger.error(`Erreur lors de la connexion: ${error}`);
            res.status(500).json({ message: "Erreur lors de la connexion" });
        }
    },

    register: async (req: Request, res: Response) => {
        try {
            const { firstName,lastName,address, email, password } = req.body;
            const picture = req.file;
            if (!firstName|| !email || !password || !lastName || !address) {
                logger.warn("Tentative de création d'un utilisateur sans nom, email ou mot de passe");
                return res.status(400).json({ message: "Nom, email et mot de passe requis" });
            }

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await userService.findUserByEmail(email);

            if (existingUser) {
                logger.warn(`Tentative de création d'un utilisateur avec un email existant: ${email}`);
                return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
            }

            // Créer un nouvel utilisateur
            let user = await userService.createUser(email,lastName,firstName,address);

            if (picture && picture.buffer) {
                const url = await userService.uploadProfilePicture(picture.buffer);
                if (!url) {
                    throw new Error('Erreur lors de l\'upload de l\'image');
                }
                user = await userService.setPictureProfile(user.id, url.secure_url, url.public_id);
            }
            const salt = await bcrypt.genSalt(10);

            await authLocalService.addAuthLocalToUser(user.id, password, salt);

            logger.info(`Utilisateur créé avec succès avec l'ID: ${user.id}`);
            res.status(201).json({ message: "Utilisateur créé avec succès", user });
        } catch (error) {
            logger.error(`Erreur lors de l'enregistrement de l'utilisateur: ${error}`);
            res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur" + error });
        }
    },
    resetPassword: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const user = await userService.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            const token = uuidv4();
            // 15 minutes
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await authLocalService.createPasswordResetToken(user.id, token, expiresAt);

            if (!process.env.FRONTEND_URL) {
                throw new Error('CLIENT_URL manquant dans le fichier .env');
            }

            const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

            await mailService.sendPasswordResetEmail(email, link);

            res.status(200).json({ message: "Email de réinitialisation envoyé" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la demande de réinitialisation du mot de passe" });
        }
    },
    updatePasswordWithToken: async (req: Request, res: Response) => {
        try {
            const { token, newPassword } = req.body;

            const passwordResetToken = await authLocalService.verifyPasswordResetToken(token);

            if (!passwordResetToken.valid) {
                logger.warn(`Tentative de réinitialisation du mot de passe avec un token invalide: ${token}`);
                return res.status(400).json({ message: "Token invalide ou expiré" });
            }

            // Hasher le nouveau mot de passe
            const salt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(newPassword, salt);

            if (!passwordResetToken.user) {
                logger.warn(`Tentative de réinitialisation du mot de passe avec un token invalide: ${token}`)
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            // Mettre à jour le mot de passe de l'utilisateur
            await authLocalService.updateUserPassword(passwordResetToken.user.id, hashedPassword,salt);

            // Optionnellement, supprimer le token de réinitialisation du mot de passe pour éviter sa réutilisation
            await authLocalService.deletePasswordResetToken(token);

            await mailService.sendPasswordResetSuccessEmail(passwordResetToken.user.email);

            logger.info(`Mot de passe réinitialisé avec succès pour l'utilisateur: ${passwordResetToken.user.id}`);
            return res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe" });
        }
    }


}

export default authLocalController;