import prisma from "../prisma";
import {logger} from "../helpers/loggers.vercel";
import {GameData} from "../types/modelGame";


const gameService = {
    /**
     * Récupère tous les jeux
     * @param page
     * @param pageSize
     * @param name
     */
    getAllGames: async (page: number, pageSize: number, name?: string) => {
        const skip = (page - 1) * pageSize;
        const whereClause = name ? { name: { contains: name } } : {};

        try {
            const games = await prisma.jeux.findMany({
                where: whereClause,
                skip: skip,
                take: pageSize,
            });
            logger.info(`Récupération des jeux avec succès`);
            return games;

        } catch (error) {
            throw new Error(`Erreur lors de la récupération des jeux: ${error}`);
        }
  },
    /**
     * Récupère un jeu par son id
     * @param id
     */
    getGameById: async (id: number) => {
        try {
            const game = await prisma.jeux.findUnique({
                where: {
                    idGame: id
                }
            });
            logger.info(`Récupération du jeu avec succès`);
            return game;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du jeu: ${error}`);
        }
    },
    /**
     * Delete a game by its id
     * @param id
     */
    deleteGameById: async (id: number) => {
        try {
            const game = await prisma.jeux.delete({
                where: {
                    idGame: id
                }
            });
            logger.info(`Suppression du jeu avec succès`);
            return game;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du jeu: ${error}`);
        }
    },
    /**
     * Créer un jeu
     * @param game
     */
    createGame: async (game: GameData) => {
        try {
            const newGame = await prisma.jeux.create({
                data: game
            });
            logger.info(`Création du jeu avec succès`);
            return newGame;
        } catch (error) {
            throw new Error(`Erreur lors de la création du jeu: ${error}`);
        }},
    /**
     * Met à jour un jeu
     * @param id
     * @param game
     */
    updateGame: async (id: number, game: GameData) => {
        try {
            const updatedGame = await prisma.jeux.update({
                where: {
                    idGame: id
                },
                data: game
            });
            logger.info(`Mise à jour du jeu avec succès`);
            return updatedGame;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du jeu: ${error}`);
        }
    },
};



export default gameService;