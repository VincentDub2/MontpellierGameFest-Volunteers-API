import { Request, Response } from 'express';
import posteEspaceService from '../services/posteEspace.service';
import { logger } from '../helpers/loggers.vercel';

const posteEspaceController = {
    addPosteEspace: async (req: Request, res: Response) => {
        const { idPoste, idEspace } = req.body;
        try {
            const newPosteEspace = await posteEspaceService.addPosteEspace(idPoste, idEspace);
            res.status(201).json(newPosteEspace);
        } catch (error) {
            logger.error(`Error creating posteEspace: ${error}`);
            res.status(500).json({ message: 'Error creating posteEspace' });
        }
    },

    getPosteEspaceById: async (req: Request, res: Response) => {
        const { idPoste, idEspace } = req.params;
        try {
            const posteEspace = await posteEspaceService.getPosteEspaceById(parseInt(idPoste), parseInt(idEspace));
            res.json(posteEspace);
        } catch (error) {
            logger.error(`Error retrieving posteEspace: ${error}`);
            res.status(500).json({ message: 'Error retrieving posteEspace' });
        }
    },

    getPosteEspaceByPosteId: async (req: Request, res: Response) => {
        const { idPoste } = req.params;
        try {
            const posteEspace = await posteEspaceService.getPosteEspaceByPosteId(parseInt(idPoste));
            res.json(posteEspace);
        } catch (error) {
            logger.error(`Error retrieving posteEspace: ${error}`);
            res.status(500).json({ message: 'Error retrieving posteEspace' });
        }
    },

    deletePosteEspace: async (req: Request, res: Response) => {
        const { idPoste, idEspace } = req.params;
        try {
            await posteEspaceService.deletePosteEspace(parseInt(idPoste), parseInt(idEspace));
            res.json({ message: 'PosteEspace deleted successfully' });
        } catch (error) {
            logger.error(`Error deleting posteEspace: ${error}`);
            res.status(500).json({ message: 'Error deleting posteEspace' });
        }
    },
};

export default posteEspaceController;
