import {Request, Response} from "express";
import userService from "../services/user.service";


const userController = {
    // Rediriger l'utilisateur vers le fournisseur OAuth
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Erreur dans la recuperation des users" });
        }
    },
    createUsers: async (req: Request, res: Response) => {
        try {
            const users = await userService.createUser();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la creation du user" });
        }
    }
}

export default userController;