import { Request, Response } from 'express';
import isPlayService from '../services/isPlay.service';
import { logger } from '../helpers/loggers.vercel';

const isPlayController = {
    // Ajouter un jeu joué à un festival
    addPlay: async (req: Request, res: Response) => {
        const { idGame, idFestival, idEspace } = req.body;
        try {
            const newPlay = await isPlayService.addPlay(idGame, idFestival, idEspace);
            res.status(201).json(newPlay);
        } catch (error) {
            logger.error(`Error adding play: ${error}`);
            res.status(500).json({ message: 'Error adding play' });
        }
    },

    // Ajouter plusieurs jeux joués à un festival
    addMultiplePlays: async (req: Request, res: Response) => {
        const playsData = req.body;
        console.log(playsData)
        try {
            const newPlays = await isPlayService.addMultiplePlays(playsData);
            res.status(201).json(newPlays);
        } catch (error) {
            logger.error(`Error adding plays: ${error}`);
            res.status(500).json({ message: 'Error adding plays' });
        }
    },

    // Obtenir tous les jeux joués d'un espace à un festival
    getPlayById: async (req: Request, res: Response) => {
        const { idEspace, idFestival } = req.params;
        try {
            const play = await isPlayService.getPlaysById(parseInt(idEspace), parseInt(idFestival));
            if (play) {
                res.json(play);
            } else {
                res.status(404).json({ message: 'Play not found' });
            }
        } catch (error) {
            logger.error(`Error retrieving play: ${error}`);
            res.status(500).json({ message: 'Error retrieving play' });
        }
    },

    // Supprimer un jeu joué
    deletePlay: async (req: Request, res: Response) => {
        const { idGame, idFestival, idEspace } = req.params;
        try {
            await isPlayService.deletePlay(parseInt(idGame), parseInt(idFestival), parseInt(idEspace));
            res.status(200).json({ message: 'Play deleted' });
        } catch (error) {
            logger.error(`Error deleting play: ${error}`);
            res.status(500).json({ message: 'Error deleting play' });
        }
    }
};

export default isPlayController;
