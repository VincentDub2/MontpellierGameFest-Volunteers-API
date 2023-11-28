import {Request, Response} from "express";
import userService from "../services/user.service";
import UserService from "../services/user.service";
import {UserRequest} from "../types/types";



const userController = {
    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.query; // Obtenez le token de la requête

            if (typeof token !== 'string') {
                return res.status(400).json({ message: "Token invalide" });
            }
            await UserService.verifyEmail(token);
            res.status(200).json({ message: "Email vérifié avec succès." });
        } catch (error) {
            res.status(400).json({ message: "Échec de la vérification de l'email: " + error });
        }
    },
    getCurrentUser: async (req: Request, res: Response) => {

        try {
            const userReq = req as UserRequest;
            if (!userReq.user) {
                return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
            }
            res.json(userReq.user);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
        }
    }
}

export default userController;