import { Request, Response } from 'express';
import { logger } from '../helpers/loggers.vercel';
import planing from "./planing";
import planingService from "../services/planing.service";

const planingController = {


    getPlaningForUser: async (req: Request, res: Response) => {
        const { idUser, idFestival } = req.params;
        try {
            const planing = await planingService.getPlaningForUser(idUser, parseInt(idFestival));
            res.json(planing);
        } catch (error) {
            logger.error('Failed to get planning for user', { idUser, idFestival, error });
            res.status(500).json({ message: 'Failed to get planning for user' });
        }


    }


}

export default planingController;
