import { Request, Response } from 'express';
import isPresentedService from '../services/isPresented.service';
import { logger } from '../helpers/loggers.vercel';

const isPresentedController = {
    // Ajouter une présentation
    addPresentation: async (req: Request, res: Response) => {
        const { idGame, idEvent } = req.body;
        try {
            const newPresentation = await isPresentedService.addPresentation(idGame, idEvent);
            res.status(201).json(newPresentation);
        } catch (error) {
            logger.error(`Error adding presentation: ${error}`);
            res.status(500).json({ message: 'Error adding presentation' });
        }
    },

    // Obtenir une présentation par ID
    getPresentationById: async (req: Request, res: Response) => {
        const { idGame, idEvent } = req.params;
        try {
            const presentation = await isPresentedService.getPresentationById(parseInt(idGame), parseInt(idEvent));
            res.json(presentation);
        } catch (error) {
            logger.error(`Error retrieving presentation: ${error}`);
            res.status(500).json({ message: 'Error retrieving presentation' });
        }
    },

    // Mettre à jour une présentation
    updatePresentation: async (req: Request, res: Response) => {
        const { idGame, idEvent } = req.params;
        const { newIdGame, newIdEvent } = req.body;
        try {
            const updatedPresentation = await isPresentedService.updatePresentation(parseInt(idGame), parseInt(idEvent), newIdGame, newIdEvent);
            res.json(updatedPresentation);
        } catch (error) {
            logger.error(`Error updating presentation: ${error}`);
            res.status(500).json({ message: 'Error updating presentation' });
        }
    },

    // Supprimer une présentation
    deletePresentation: async (req: Request, res: Response) => {
        const { idGame, idEvent } = req.params;
        try {
            await isPresentedService.deletePresentation(parseInt(idGame), parseInt(idEvent));
            res.status(200).json({ message: 'Presentation deleted' });
        } catch (error) {
            logger.error(`Error deleting presentation: ${error}`);
            res.status(500).json({ message: 'Error deleting presentation' });
        }
    }
};

export default isPresentedController;
