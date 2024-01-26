import { Request, Response } from 'express';
import espaceService from '../services/espace.service';
import { logger } from '../helpers/loggers.vercel';

const espaceController = {
    addEspace: async (req: Request, res: Response) => {
        const { name } = req.body;
        try {
            const newEspace = await espaceService.addEspace(name);
            res.status(201).json(newEspace);
        } catch (error) {
            logger.error(`Error creating espace: ${error}`);
            res.status(500).json({ message: 'Error creating espace' });
        }
    },

    getEspaceById: async (req: Request, res: Response) => {
        const { idEspace } = req.params;
        try {
            const espace = await espaceService.getEspaceById(parseInt(idEspace));
            res.json(espace);
        } catch (error) {
            logger.error(`Error retrieving espace: ${error}`);
            res.status(500).json({ message: 'Error retrieving espace' });
        }
    },

    getAllEspaces: async (req: Request, res: Response) => {
        try {
            const espaces = await espaceService.getAllEspaces();
            res.json(espaces);
        } catch (error) {
            logger.error(`Error retrieving all espaces: ${error}`);
            res.status(500).json({ message: 'Error retrieving all espaces' });
        }
    },

    updateEspace: async (req: Request, res: Response) => {
        const { idEspace } = req.params;
        const { name } = req.body;
        try {
            const updatedEspace = await espaceService.updateEspace(parseInt(idEspace), name);
            res.json(updatedEspace);
        } catch (error) {
            logger.error(`Error updating espace: ${error}`);
            res.status(500).json({ message: 'Error updating espace' });
        }
    },

    deleteEspace: async (req: Request, res: Response) => {
        const { idEspace } = req.params;
        try {
            await espaceService.deleteEspace(parseInt(idEspace));
            res.json({ message: 'Espace deleted successfully' });
        } catch (error) {
            logger.error(`Error deleting espace: ${error}`);
            res.status(500).json({ message: 'Error deleting espace' });
        }
    },
};

export default espaceController;
