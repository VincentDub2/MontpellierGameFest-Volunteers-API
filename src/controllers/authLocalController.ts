import {Request, Response} from "express";
import userService from "../services/user.service";
import authLocalService from "../services/authLocal.service";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import {logger} from "../helpers/loggers";
import {findOrCreateUser} from "../services/oauth.service";


const MAX_ATTEMPTS = 5; // Nombre maximal de tentatives
const LOCK_TIME = 2 * 60 * 60 * 1000; // Temps de blocage (par exemple, 2 heures)

const authLocalController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                logger.warn("Tentative de connexion sans email ou mot de passe");
                return res.status(400).json({ message: "Email et mot de passe requis" });
            }

            const user = await userService.findUserByEmail(email);
            if (!user || !user.authLocal) {
                logger.warn(`Tentative de connexion avec un utilisateur inexistant: ${email}`);
                return res.status(400).json({ message: "Utilisateur introuvable" });
            }

            if (user.authLocal.lockUntil && user.authLocal.lockUntil > new Date()) {
                logger.warn(`Tentative de connexion avec un utilisateur verrouillé: ${email}`);
                return res.status(400).json({ message: "Le compte est verrouillé. Veuillez réessayer plus tard" });
            }

            const isPasswordValid = await authLocalService.verifyPassword(password,user.authLocal.hashedPassword, user.authLocal.salt);

            if (!isPasswordValid) {
                await authLocalService.updateFailedAttempts(user.id, user.authLocal.failedAttempts + 1);
                logger.warn(`Tentative de connexion avec un mot de passe incorrect pour l'utilisateur: ${user.id}`);
                if (user.authLocal.failedAttempts + 1 >= MAX_ATTEMPTS) {
                    logger.warn(`L'utilisateur: ${user.id} a dépassé le nombre maximal de tentatives de connexion. Verrouillage du compte`);
                    await authLocalService.blockUser(user.id, new Date(Date.now() + LOCK_TIME));
                    await userService.sendEmailBlockAccount(user.email);
                    return res.status(400).json({ message: "Le compte est verrouillé. Veuillez réessayer plus tard" });
                }
                return res.status(400).json({ message: "Mot de passe incorrect" });
            }
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET manquant dans le fichier .env');
            }
            // Générer un token JWT
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await authLocalService.updateFailedAttempts(user.id, 0);
            await authLocalService.resetUserLock(user.id);
            logger.info(`Utilisateur connecté avec succès avec l'ID: ${user.id}`);
            res.json({ token }); // Envoyer le token à l'utilisateur
        } catch (error) {
            logger.error(`Erreur lors de la connexion: ${error}`);
            res.status(500).json({ message: "Erreur lors de la connexion" });
        }
    },

    register: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
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
            const user = await userService.createUser(email, name);

            const salt = await bcrypt.genSalt(10);

            await authLocalService.addAuthLocalToUser(user.id, password, salt);
            await userService.sendEmailWelcome(user.email);
            logger.info(`Utilisateur créé avec succès avec l'ID: ${user.id}`);
            res.status(201).json({ message: "Utilisateur créé avec succès", user });
        } catch (error) {
            logger.error(`Erreur lors de l'enregistrement de l'utilisateur: ${error}`);
            res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur" });
        }
    }

}

export default authLocalController;