import { Request, Response } from 'express';
import isReferentService from '../services/referent.service';
import { logger } from '../helpers/loggers.vercel';

const isReferentController = {
    // Ajouter un référent
    addReferent: async (req: Request, res: Response) => {
        const { idUser, idEspace, jeuxIdGame } = req.body;
        try {
            const newReferent = await isReferentService.addReferent(idUser, idEspace, jeuxIdGame);
            res.status(201).json(newReferent);
        } catch (error) {
            logger.error(`Error adding referent: ${error}`);
            res.status(500).json({ message: 'Error adding referent' });
        }
    },

    // Obtenir un référent par ID
    getReferentById: async (req: Request, res: Response) => {
        const { idUser, idEspace } = req.params;
        try {
            const referent = await isReferentService.getReferentById(idUser, parseInt(idEspace));
            res.json(referent);
        } catch (error) {
            logger.error(`Error retrieving referent: ${error}`);
            res.status(500).json({ message: 'Error retrieving referent' });
        }
    },

    // Mettre à jour un référent
    updateReferent: async (req: Request, res: Response) => {
        const { idUser, idEspace } = req.params;
        const { jeuxIdGame } = req.body;

        try {
            const updatedReferent = await isReferentService.updateReferent(idUser, parseInt(idEspace), jeuxIdGame);
            if (updatedReferent) {
                res.json(updatedReferent);
            } else {
                res.status(404).json({ message: 'Référent non trouvé' });
            }
        } catch (error) {
            logger.error(`Error updating referent: ${error}`);
            res.status(500).json({ message: 'Erreur lors de la mise à jour du référent' });
        }
    },

    // Supprimer un référent
    deleteReferent: async (req: Request, res: Response) => {
        const { idUser, idEspace } = req.params;
        try {
            await isReferentService.deleteReferent(idUser, parseInt(idEspace));
            res.status(200).json({ message: 'Référent supprimé' });
        } catch (error) {
            logger.error(`Error deleting referent: ${error}`);
            res.status(500).json({ message: 'Error deleting referent' });
        }
    },

    // Autres méthodes selon les besoins...
};

export default isReferentController;
