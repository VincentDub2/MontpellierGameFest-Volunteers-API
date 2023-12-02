import {Request, Response} from "express";
import userService from "../services/user.service";
import UserService from "../services/user.service";
import {UserRequest} from "../types/types";
import {logger} from "../helpers/loggers";
import mailHelpers from "../helpers/mailHelpers";



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
            await mailHelpers.sendWelcomeEmail(user.email, user.name);

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
}

export default userController;