import gameService from "../services/game.service";
import { Request, Response } from 'express';

const gameController = {
    /**
     * Get all games with pagination, and filter by name
     * @param req
     * @param res
     */
    getAllGames: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 20;
            const name = req.query.name as string | undefined;
            const games = await gameService.getAllGames(page, pageSize, name);
            res.json(games);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des jeux" });
        }
    },
    /**
     * Get a game by its id
     * @param req
     * @param res
     */
    getGameById: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const game = await gameService.getGameById(id);
            res.json(game);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du jeu" });
        }
    },
    /**
     * Delete a game by its id
     * @param req
     * @param res
     */
    deleteGameById: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const game = await gameService.deleteGameById(id);
            res.json(game);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du jeu :"+ error });
        }
    },
    /**
     * Create a game
     * @param req
     * @param res
     */
    createGame: async (req: Request, res: Response) => {
        try {
            const game = await gameService.createGame(req.body);
            res.json(game);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du jeu :"+ error });
        }
    },
    /**
     * Update a game by its id
     * @param req
     * @param res
     */
    updateGame: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const game = await gameService.updateGame(id, req.body);
            res.json(game);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du jeu :" + error });
        }
    },
}


export default gameController;