import { Request, Response } from 'express';
import isPresentService from '../services/isPresent.service';
import { logger } from '../helpers/loggers.vercel';

const isPresentController = {
    // Ajouter une présence
    addPresence: async (req: Request, res: Response) => {
        const { idFestival, idUser, date, jeuxIdGame } = req.body;
        try {
            const newPresence = await isPresentService.addPresence(idFestival, idUser, new Date(date), jeuxIdGame);
            res.status(201).json(newPresence);
        } catch (error) {
            logger.error(`Error adding presence: ${error}`);
            res.status(500).json({ message: 'Error adding presence' });
        }
    },

    // Obtenir une présence par ID
    getPresenceById: async (req: Request, res: Response) => {
        const { idFestival, idUser, date } = req.params;
        try {
            const presence = await isPresentService.getPresenceById(parseInt(idFestival), idUser, new Date(date));
            res.json(presence);
        } catch (error) {
            logger.error(`Error retrieving presence: ${error}`);
            res.status(500).json({ message: 'Error retrieving presence' });
        }
    },

    // Mettre à jour une présence
    updatePresence: async (req: Request, res: Response) => {
        const { idFestival, idUser, date } = req.params;
        const { jeuxIdGame } = req.body;
        try {
            const updatedPresence = await isPresentService.updatePresence(parseInt(idFestival), idUser, new Date(date), jeuxIdGame);
            res.json(updatedPresence);
        } catch (error) {
            logger.error(`Error updating presence: ${error}`);
            res.status(500).json({ message: 'Error updating presence' });
        }
    },

    // Supprimer une présence
    deletePresence: async (req: Request, res: Response) => {
        const { idFestival, idUser, date } = req.params;
        try {
            await isPresentService.deletePresence(parseInt(idFestival), idUser, new Date(date));
            res.status(200).json({ message: 'Presence deleted' });
        } catch (error) {
            logger.error(`Error deleting presence: ${error}`);
            res.status(500).json({ message: 'Error deleting presence' });
        }
    }
};

export default isPresentController;
