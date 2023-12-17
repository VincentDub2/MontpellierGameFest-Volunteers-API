import { Request, Response } from 'express';
import userAssociationService from "../services/userAssociation.service";
import {logger} from "../helpers/loggers.vercel";


const userAssociationController = {
    /**
     * Cette route permet d'ajouter un utilisateur à une association
     * @param req
     * @param res
     */
    addUserToAssociation: async (req: Request, res: Response) => {
        try {
            const userId = req.body.userId;
            const associationId = req.body.associationId;

            if (!userId || !associationId) {
                logger.warn(`Erreur lors de l'ajout de l'utilisateur à l'association: Veuillez renseigner l'identifiant de l'utilisateur et de l'association`);
                return res.status(400).json({ message: "Veuillez renseigner l'identifiant de l'utilisateur et de l'association" });
            }

            const userAssociation = await userAssociationService.addUserToAssociation(userId, associationId);
            res.json(userAssociation);
        } catch (error) {
            logger.error(`Erreur lors de l'ajout de l'utilisateur à l'association: ${error}`);
            res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur à l'association" });
        }
    },
    /**
     * Cette route permet de récupérer toutes les associations d'un utilisateur
     * @param req
     * @param res
     */
    getUserAssociations: async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;

            if (!userId) {
                logger.warn(`Erreur lors de la récupération des associations de l'utilisateur: Veuillez renseigner l'identifiant de l'utilisateur`);
                return res.status(400).json({ message: "Veuillez renseigner l'identifiant de l'utilisateur" });
            }

            const userAssociations = await userAssociationService.getUserAssociations(userId);
            res.json(userAssociations);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des associations de l'utilisateur: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération des associations de l'utilisateur" });
        }
    },
    /**
     * Cette route permet de supprimer une association entre un utilisateur et un groupe
     * @param req
     * @param res
     */
    deleteUserAssociation: async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;
            const associationId = req.params.associationId;

            if (!userId || !associationId) {
                logger.warn(`Erreur lors de la suppression de l'association entre l'utilisateur et le groupe: Veuillez renseigner l'identifiant de l'utilisateur et de l'association`);
                return res.status(400).json({ message: "Veuillez renseigner l'identifiant de l'utilisateur et de l'association" });
            }

            const userAssociation = await userAssociationService.deleteUserAssociation(userId,parseInt(associationId));
            res.json(userAssociation);
        } catch (error) {
            logger.error(`Erreur lors de la suppression de l'association entre l'utilisateur et le groupe: ${error}`);
            res.status(500).json({ message: "Erreur lors de la suppression de l'association entre l'utilisateur et le groupe" });
        }
    },
    /**
     * Cette route permet de récupérer tous les utilisateurs d'une association
     * @param req
     * @param res
     */
    getAssociationUsers: async (req: Request, res: Response) => {
        try {
            const associationId = req.params.associationId;

            if (!associationId) {
                logger.warn(`Erreur lors de la récupération des utilisateurs de l'association: Veuillez renseigner l'identifiant de l'association`);
                return res.status(400).json({ message: "Veuillez renseigner l'identifiant de l'association" });
            }

            const users = await userAssociationService.getAssociationUsers(parseInt(associationId));
            res.json(users);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des utilisateurs de l'association: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs de l'association" });
        }
    }

}

export default userAssociationController;