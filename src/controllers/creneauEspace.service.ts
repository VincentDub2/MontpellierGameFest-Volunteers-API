import { Request, Response } from 'express';
import creneauEspaceService from '../services/creneauEspace.service';
import { logger } from '../helpers/loggers.vercel';

const creneauEspaceController = {
    // Ajouter un nouveau CreneauEspace
    addCreneauEspace: async (req: Request, res: Response) => {
        const { idCreneau, idEspace, capacityEspace } = req.body;
        try {
            const newCreneauEspace = await creneauEspaceService.addCreneauEspace(idCreneau, idEspace, capacityEspace);
            res.status(201).json(newCreneauEspace);
        } catch (error) {
            logger.error(`Error adding CreneauEspace: ${error}`);
            res.status(500).json({ message: 'Error adding CreneauEspace' });
        }
    },

    // Obtenir un CreneauEspace par son ID
    getCreneauEspaceById: async (req: Request, res: Response) => {
        const { idCreneauEspace } = req.params;
        try {
            const creneauEspace = await creneauEspaceService.getCreneauEspaceById(parseInt(idCreneauEspace));
            res.json(creneauEspace);
        } catch (error) {
            logger.error(`Error retrieving CreneauEspace: ${error}`);
            res.status(500).json({ message: 'Error retrieving CreneauEspace' });
        }
    },

    // Obtenir un CreneauEspace par l'ID du creneau associé
    getCreneauEspaceByCreneauId: async (req: Request, res: Response) => {
        const { idCreneau } = req.params;
        try {
            const creneauEspace = await creneauEspaceService.getCreneauEspaceByCreneauId(parseInt(idCreneau));
            res.json(creneauEspace);
        } catch (error) {
            logger.error(`Error retrieving CreneauEspace: ${error}`);
            res.status(500).json({ message: 'Error retrieving CreneauEspace' });
        }
    },

    // Obtenir tous les CreneauEspaces
    getAllCreneauEspaces: async (req: Request, res: Response) => {
        try {
            const creneauEspaces = await creneauEspaceService.getAllCreneauEspaces();
            res.json(creneauEspaces);
        } catch (error) {
            logger.error(`Error retrieving all CreneauEspaces: ${error}`);
            res.status(500).json({ message: 'Error retrieving all CreneauEspaces' });
        }
    },

    // Mettre à jour un CreneauEspace
    updateCreneauEspace: async (req: Request, res: Response) => {
        const { idCreneauEspace } = req.params;
        const { capacityEspace } = req.body;
        try {
            const updatedCreneauEspace = await creneauEspaceService.updateCreneauEspace(parseInt(idCreneauEspace), capacityEspace);
            res.json(updatedCreneauEspace);
        } catch (error) {
            logger.error(`Error updating CreneauEspace: ${error}`);
            res.status(500).json({ message: 'Error updating CreneauEspace' });
        }
    },

    // Supprimer un CreneauEspace
    deleteCreneauEspace: async (req: Request, res: Response) => {
        const { idCreneauEspace } = req.params;
        try {
            await creneauEspaceService.deleteCreneauEspace(parseInt(idCreneauEspace));
            res.status(200).json({ message: 'CreneauEspace deleted' });
        } catch (error) {
            logger.error(`Error deleting CreneauEspace: ${error}`);
            res.status(500).json({ message: 'Error deleting CreneauEspace' });
        }
    }
};

export default creneauEspaceController;
