import { Request, Response } from 'express';
import inscriptionService from '../services/inscription.service';
import { logger } from '../helpers/loggers.vercel';

const inscriptionController = {
    // Ajouter une nouvelle inscription
    addInscription: async (req: Request, res: Response) => {
        const { idUser, idCreneauEspace, jeuxIdGame } = req.body;
        const isAccepted = false;
        let isFlexible = req.body.isFlexible;
        
        if(isFlexible !== true) {
            isFlexible = false;
        }

        try {
            const newInscription = await inscriptionService.addInscription(idUser, idCreneauEspace, isAccepted, isFlexible, jeuxIdGame);
            res.status(201).json(newInscription);
        } catch (error) {
            logger.error(`Error adding Inscription: ${error}`);
            res.status(500).json({ message: 'Error adding Inscription' });
        }
    },

    // Obtenir une inscription par ID
    getInscriptionById: async (req: Request, res: Response) => {
        const { idUser, idCreneauEspace } = req.params;
        try {
            const inscription = await inscriptionService.getInscriptionById(idUser, parseInt(idCreneauEspace));
            res.json(inscription);
        } catch (error) {
            logger.error(`Error retrieving Inscription: ${error}`);
            res.status(500).json({ message: 'Error retrieving Inscription' });
        }
    },

    // Mettre à jour une inscription
    updateInscription: async (req: Request, res: Response) => {
        const { idUser, idCreneauEspace } = req.params;
        const { isAccepted, isFlexible, jeuxIdGame } = req.body;
        try {
            const updatedInscription = await inscriptionService.updateInscription(idUser, parseInt(idCreneauEspace), isAccepted, isFlexible, jeuxIdGame);
            res.json(updatedInscription);
        } catch (error) {
            logger.error(`Error updating Inscription: ${error}`);
            res.status(500).json({ message: 'Error updating Inscription' });
        }
    },

    // Supprimer une inscription
    deleteInscription: async (req: Request, res: Response) => {
        const { idUser, idCreneauEspace } = req.params;
        try {
            await inscriptionService.deleteInscription(idUser, parseInt(idCreneauEspace));
            res.status(200).json({ message: 'Inscription deleted' });
        } catch (error) {
            logger.error(`Error deleting Inscription: ${error}`);
            res.status(500).json({ message: 'Error deleting Inscription' });
        }
    },
    //Obtenir toutes les inscriptions d'un utilisateur a un festival
    getInscriptionsByUserAndFestival: async (req: Request, res: Response) => {
        const { idUser, idFestival } = req.params;
        try {
            const inscriptions = await inscriptionService.getAllInscriptionsByUser(idUser, parseInt(idFestival));
            res.json(inscriptions);
        } catch (error) {
            logger.error(`Error retrieving Inscriptions: ${error}`);
            res.status(500).json({ message: `Error retrieving Inscriptions: ${error}`});
        }
    }
};

export default inscriptionController;
