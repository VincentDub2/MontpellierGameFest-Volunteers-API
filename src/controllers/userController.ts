import {Request, Response} from "express";
import userService from "../services/user.service";
import UserService from "../services/user.service";
import {UserRequest} from "../types/types";
import {logger} from "../helpers/loggers";



const userController = {
    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.query; // Obtenez le token de la requête

            if (typeof token !== 'string') {
                logger.warn("Tentative de vérification d'email avec un token invalide.");
                return res.status(400).json({ message: "Token invalide" });
            }
            await UserService.verifyEmail(token);
            logger.info(`Email vérifié avec succès pour le token: ${token}`);
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
    }
}

export default userController;