import {Request, Response} from "express";
import userService from "../services/user.service";
import UserService from "../services/user.service";
import {UserRequest} from "../types/types";
import {logger} from "../helpers/loggers.vercel";
import mailHelpers from "../helpers/mailHelpers";
import { update } from "lodash";



const userController = {
    // Cette route permet a l'utilisateur de confirmer son email
    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.query;
            // On récupére le token dans la réquete

            // On vérifie si le token est présent
            if (!token) {
                logger.warn("Tentative de vérification d'email avec un token vide ou null.");
                return res.status(400).json({ message: "Token invalide" });
            }

            // On vérifie si le token est une chaine de caractère
            if (typeof token !== 'string') {
                logger.warn("Tentative de vérification d'email avec un token invalide.");
                return res.status(400).json({ message: "Token invalide" });
            }
            // On vérifie si le token est valide avec le token de vérification de l'email
            const user = await UserService.verifyEmail(token);
            logger.info(`Email vérifié avec succès pour le token: ${token}`);

            // On renvoie un message de succès
            await mailHelpers.sendWelcomeEmail(user.email,user.firstName);

            res.status(200).json({ message: "Email vérifié avec succès." });
        } catch (error) {
            logger.error(`Erreur lors de la vérification de l'email: ${error}`);
            res.status(400).json({ message: "Échec de la vérification de l'email: " + error });
        }
    },
    getCurrentUser: async (req: Request, res: Response) => {
        try {
            const userReq = req as UserRequest;
            if (!userReq.user) {
                logger.warn("Tentative de récupération de l'utilisateur sans jeton d'authentification");
                return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
            }
            logger.info(`Récupération de l'utilisateur avec l'ID: ${userReq.user.id}`);
            res.json(userReq.user);
        } catch (error) {
            logger.error(`Erreur lors de la récupération de l'utilisateur: ${error}`)
            res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
        }
    },
    updateUserPicture: async (req: Request, res: Response) => {
        try {
            const userReq = req as UserRequest;
            if (!userReq.user) {
                logger.warn("Tentative de récupération de l'utilisateur sans jeton d'authentification");
                return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
            }
            if (!req.file) {
                logger.warn("Tentative de mise à jour de la photo de profil sans fichier");
                return res.status(400).json({ message: "Veuillez sélectionner un fichier" });
            }
            if (userReq.user.pictureId) {
                logger.info(`Suppression de l'ancienne photo de profil avec l'ID: ${userReq.user.pictureId}`);
                await userService.deleteProfilePicture(userReq.user.pictureId);
            }
            const url = await userService.uploadProfilePicture(req.file.buffer)
            if (!url) {
                throw new Error('Erreur lors de l\'upload de l\'image');
            }
            const user = await userService.setPictureProfile(userReq.user.id, url.secure_url, url.public_id);

            logger.info(`Photo de profil mise à jour pour l'utilisateur avec l'ID: ${user.id}`);

            res.json(user);
        } catch (error) {
            logger.error(`Erreur lors de la mise à jour de la photo de profil: ${error}`);
            res.status(500).json({ message: "Erreur lors de la mise à jour de la photo de profil" });
        }
    },
    updateUser: async (req: Request, res: Response) => {
        const {id} = req.params;
        const { firstName, lastName, email,address ,phoneNumbe } = req.body;
        console.log(req.body);
        console.log(address);
        try {
            const userReq = req as UserRequest;
            if (!userReq.user) {
                logger.warn("Tentative de récupération de l'utilisateur sans jeton d'authentification");
                return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
            }
            const user = await userService.updateUser(userReq.user.id, req.body);
            logger.info(`Utilisateur mis à jour avec l'ID: ${user.id}`);
            res.json(user);
        } catch (error) {
            logger.error(`Erreur lors de la mise à jour de l'utilisateur: ${error}`);
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
        }
    }
}

export default userController;