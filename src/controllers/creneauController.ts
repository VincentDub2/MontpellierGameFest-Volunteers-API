import { Request, Response } from 'express';
import creneauService from '../services/creneau.service';
import { logger } from '../helpers/loggers.vercel';

const creneauController = {
    // Ajouter un nouveau créneau
    addCreneau: async (req: Request, res: Response) => {
        const { timeStart, timeEnd, idFestival } = req.body;
        try {
            const newCreneau = await creneauService.addCreneau(timeStart, timeEnd, idFestival);
            if (newCreneau) {
                res.status(201).json(newCreneau);
                logger.info(`Créneau ajouté avec succès: ${newCreneau.idCreneau}`);
            } else {
                res.status(500).json({ message: 'Erreur lors de la création du créneau' });
                logger.error('Erreur lors de la création du créneau');
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },
    addMultipleCreneaux: async (req: Request, res: Response) => {
        const { creneauxData } = req.body;
        try {
            const newCreneaux = await creneauService.addMultipleCreneaux(creneauxData);
            if (newCreneaux) {
                res.status(201).json(newCreneaux);
                logger.info(`Créneaux ajoutés avec succès: ${newCreneaux}`);
            } else {
                res.status(500).json({ message: 'Erreur lors de la création des créneaux' });
                logger.error('Erreur lors de la création des créneaux');
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },
    // Obtenir un créneau par son ID
    getCreneauById: async (req: Request, res: Response) => {
        const { idCreneau } = req.params;
        try {
            const creneau = await creneauService.getCreneauById(parseInt(idCreneau));
            if (creneau) {
                res.json(creneau);
                logger.info(`Créneau récupéré avec succès: ${creneau.idCreneau}`);
            } else {
                res.status(404).json({ message: 'Créneau non trouvé' });
                logger.warn(`Créneau non trouvé: ${idCreneau}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },

    // Obtenir tous les créneaux pour un festival donné
    getAllCreneauxByFestival: async (req: Request, res: Response) => {
        const { idFestival } = req.params;
        const { timeStart, timeEnd, idEspace, idPoste } = req.query;
        try {

            // Validation des dates
            let parsedStartDate: Date | undefined = undefined;
            let parsedEndDate: Date | undefined = undefined;

            if (typeof timeStart === 'string') {
                parsedStartDate = new Date(timeStart);
            }

            if (typeof timeEnd === 'string') {
                parsedEndDate = new Date(timeEnd);
            }

            // Validation des identifiants
            let parsedIdEspace: number | undefined = undefined;
            let parsedIdPoste: number | undefined = undefined;

            if (typeof idEspace === 'string') {
                parsedIdEspace = parseInt(idEspace);
            }

            if (typeof idPoste === 'string') {
                parsedIdPoste = parseInt(idPoste);
          }


            const creneaux = await creneauService.getAllCreneauxByFestival(parseInt(idFestival),parsedStartDate, parsedEndDate,parsedIdEspace, parsedIdPoste);
            res.json(creneaux);
            logger.info(`Créneaux récupérés avec succès pour le festival ${idFestival}`);
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },

    // Mettre à jour un créneau
    updateCreneau: async (req: Request, res: Response) => {
        const { idCreneau } = req.params;
        const { timeStart, timeEnd } = req.body;
        try {
            const updatedCreneau = await creneauService.updateCreneau(parseInt(idCreneau), timeStart, timeEnd);
            if (updatedCreneau) {
                res.json(updatedCreneau);
                logger.info(`Créneau mis à jour avec succès: ${updatedCreneau.idCreneau}`);
            } else {
                res.status(404).json({ message: 'Créneau non trouvé' });
                logger.warn(`Créneau non trouvé: ${idCreneau}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },

    // Supprimer un créneau
    deleteCreneau: async (req: Request, res: Response) => {
        const { idCreneau } = req.params;
        try {
            const deletedCreneau = await creneauService.deleteCreneau(parseInt(idCreneau));
            if (deletedCreneau) {
                res.status(200).json({ message: 'Créneau supprimé' });
                logger.info(`Créneau supprimé avec succès: ${idCreneau}`);
            } else {
                res.status(404).json({ message: 'Créneau non trouvé' });
                logger.warn(`Créneau non trouvé: ${idCreneau}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },
};

export default creneauController;
