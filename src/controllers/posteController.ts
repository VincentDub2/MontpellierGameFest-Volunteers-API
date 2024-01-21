import { Request, Response } from 'express';
import posteService from '../services/poste.service';
import { logger } from '../helpers/loggers.vercel';

const posteController = {
    // Ajouter un nouveau poste
    addPoste: async (req: Request, res: Response) => {
        const { name, capacityPoste, idFestival } = req.body;
        try {
            const newPoste = await posteService.addPoste(name, capacityPoste, idFestival);
            if (newPoste) {
                res.status(201).json(newPoste);
                logger.info(`Poste créé avec succès avec l'ID: ${newPoste.idPoste}`);
            } else {
                res.status(500).json({ message: 'Erreur lors de la création du poste' });
                logger.warn(`Erreur lors de la création du poste`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur lors de la création du poste: ${error}`);
        }
    },
    addMultiplePostes: async (req: Request, res: Response) => {
        const postesData = req.body;
        try {
            const result = await posteService.addMultiplePostes(postesData);
            res.status(201).json({ message: `${result} postes ajoutés avec succès` });
            logger.info(`${result} postes ajoutés avec succès`);
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur lors de l'ajout de plusieurs postes: ${error}`);
        }
    },
    // Obtenir un poste par son ID
    getPosteById: async (req: Request, res: Response) => {
        const { idPoste } = req.params;
        try {
            const poste = await posteService.getPosteById(parseInt(idPoste));
            if (poste) {
                res.json(poste);
                logger.info(`Poste récupéré avec succès avec l'ID: ${poste.idPoste}`);
            } else {
                res.status(404).json({ message: 'Poste non trouvé' });
                logger.warn(`Poste non trouvé avec l'ID: ${idPoste}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
        }
    },

    // Obtenir tous les postes pour un festival donné
    getAllPostesByFestival: async (req: Request, res: Response) => {
        const { idFestival } = req.params;
        try {
            const postes = await posteService.getAllPostesByFestival(parseInt(idFestival));
            res.json(postes);
            logger.info(`Récupération de tous les postes pour le festival avec l'ID: ${idFestival}`);
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur lors de la récupération de tous les postes pour le festival avec l'ID: ${idFestival}`);
        }
    },

    // Mettre à jour un poste
    updatePoste: async (req: Request, res: Response) => {
        const { idPoste } = req.params;
        const { name, capacityPoste } = req.body;
        try {
            const updatedPoste = await posteService.updatePoste(parseInt(idPoste), name, capacityPoste);
            if (updatedPoste) {
                res.json(updatedPoste);
                logger.info(`Poste mis à jour avec succès avec l'ID: ${updatedPoste.idPoste}`);
            } else {
                res.status(404).json({ message: 'Poste non trouvé' });
                logger.warn(`Poste non trouvé avec l'ID: ${idPoste}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur lors de la mise à jour du poste avec l'ID: ${idPoste}`);
        }
    },

    // Supprimer un poste
    deletePoste: async (req: Request, res: Response) => {
        const { idPoste } = req.params;
        try {
            const deletedPoste = await posteService.deletePoste(parseInt(idPoste));
            if (deletedPoste) {
                res.status(200).json({ message: 'Poste supprimé' });
                logger.info(`Poste supprimé avec succès avec l'ID: ${idPoste}`);
            } else {
                res.status(404).json({ message: 'Poste non trouvé' });
                logger.warn(`Poste non trouvé avec l'ID: ${idPoste}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur lors de la suppression du poste avec l'ID: ${idPoste}`);
        }
    },
};

export default posteController;
