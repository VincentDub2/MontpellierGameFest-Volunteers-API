import { Request, Response } from 'express';

import { logger } from '../helpers/loggers.vercel';
import eventService from "../services/event.service";

const eventController = {
    // Ajouter un nouvel événement
    addEvent: async (req: Request, res: Response) => {
        const { dateEvent,
            address,
            idManager,
            city,
            postalCode,
            country,
            duration,
            name,
            description,
        } = req.body;
        try {
            const newEvent = await eventService.addEvent(name, dateEvent, duration, address, city, postalCode, country, idManager,description);
            if (newEvent) {
                res.status(201).json(newEvent);
                logger.info(`Événement créé avec succès: ${newEvent.idEvent}`);
            } else {
                res.status(500).json({ message: 'Erreur lors de la création de l\'événement' });
                logger.error('Erreur lors de la création de l\'événement');
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },

    // Obtenir un événement par son ID
    getEventById: async (req: Request, res: Response) => {
        const { idEvent } = req.params;
        try {
            const event = await eventService.getEventById(parseInt(idEvent));
            if (event) {
                res.json(event);
                logger.info(`Événement récupéré avec succès: ${event.idEvent}`);
            } else {
                res.status(404).json({ message: 'Événement non trouvé' });
                logger.warn(`Événement non trouvé: ${idEvent}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },

    // Obtenir tous les événements
    getAllEvents: async (req: Request, res: Response) => {
        try {
            const events = await eventService.getAllEvents();
            res.json(events);
            logger.info('Tous les événements ont été récupérés avec succès');
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },

    // Mettre à jour un événement
    updateEvent: async (req: Request, res: Response) => {
        const { idEvent } = req.params;
        const { dateEvent,
            address,
            idManager,
            city,
            postalCode,
            country,
            duration,
            name,
            description,
        } = req.body;
        try {
            const updatedEvent = await eventService.updateEvent(
                parseInt(idEvent),
                name,
                dateEvent,
                duration,
                address,
                city,
                postalCode,
                country,
                idManager,
                description
            );
            if (updatedEvent) {
                res.json(updatedEvent);
                logger.info(`Événement mis à jour avec succès: ${updatedEvent.idEvent}`);
            } else {
                res.status(404).json({ message: 'Événement non trouvé' });
                logger.warn(`Événement non trouvé: ${idEvent}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },

    // Supprimer un événement
    deleteEvent: async (req: Request, res: Response) => {
        const { idEvent } = req.params;
        try {
            const deletedEvent = await eventService.deleteEvent(parseInt(idEvent));
            if (deletedEvent) {
                res.status(200).json({ message: 'Événement supprimé' });
                logger.info(`Événement supprimé avec succès: ${idEvent}`);
            } else {
                res.status(404).json({ message: 'Événement non trouvé' });
                logger.warn(`Événement non trouvé: ${idEvent}`);
            }
        } catch (error) {
            res.status(500).json({ message: `Erreur serveur: ${error}` });
            logger.error(`Erreur serveur: ${error}`);
        }
    },
};

export default eventController;
