/**
 * Ce fichier permet de gérer les routes liées aux festivals
 */
import { Request, Response } from "express";
import festivalService from "../services/festivalService";
import { logger } from "../helpers/loggers.vercel";

const festivalController = {
    /**
     * Créer un festival
     * @param req
     * @param res
     */
    createAFestival: async (req: Request, res: Response) => {
        try {
            //On met la date au bon format
            req.body.dateDebut = new Date(req.body.dateDebut);
            req.body.dateFin = new Date(req.body.dateFin);
            const festival = await festivalService.createAFestival(req.body);
            logger.info(`Création du festival avec succès`);
            res.status(200).json(festival);
        } catch (error) {
            logger.error(`Erreur lors de la création du festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la création du festival :" + error });
        }
    },
    /**
     * Récupérer tous les festivals
     * @param req
     * @param res
     */
    getAllFestivals: async (req: Request, res: Response) => {
        try {
            const festivals = await festivalService.getAllFestivals();
            logger.info(`Récupération de tous les festivals avec succès`);
            res.json(festivals);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des festivals: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération des festivals :" + error });
        }
    },
    /**
     * Récupérer un festival par son id
     * @param req
     * @param res
     */
    getFestivalById: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            console.log(id);
            if (!id){
                logger.error(`Erreur lors de la récupération du festival: id invalide`);
                res.status(500).json({ message: "Erreur lors de la récupération du festival : id invalide" });
            }
            const festival = await festivalService.getFestivalById(id);
            logger.info(`Récupération du festival avec succès`);
            res.json(festival);
        } catch (error) {
            logger.info(`Erreur lors de la récupération du festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération du festival :" + error });
        }
    },
    /** 
     * Supprimer un festival par son id
     * @param req
     * @param res
     */
    deleteFestivalById: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const festival = await festivalService.deleteFestivalById(id);
            logger.info(`Suppression du festival avec succès`);
            res.json(festival);
        } catch (error) {
            logger.error(`Erreur lors de la suppression du festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la suppression du festival :" + error });
        }
    },
    /**
     * Mettre à jour un festival par son id
     * @param req
     * @param res
     */
    updateFestival: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const festival = await festivalService.updateFestival(id, req.body);
            logger.info(`Mise à jour du festival avec succès`);
            res.json(festival);
        } catch (error) {
            logger.error(`Erreur lors de la mise à jour du festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la mise à jour du festival :" + error });
        }
    },
    /**
     * Récupérer le festival actif
     * @param req
     * @param res
     */
    getActiveFestival : async (req: Request, res: Response) => {
        try {

            const festival = await festivalService.getActiveFestival();
            logger.info(`Récupération du festival avec succès`);
            res.json(festival);
        } catch (error) {
            logger.error(`Erreur lors de la récupération du festival actif: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération du festival :" + error });
        }
    },
    /**
     * Récupérer le dernier festival
     * @param req
     * @param res
     */
    getLastFestival : async (req: Request, res: Response) => {
        try {
            const festival = await festivalService.getLastFestival();
            logger.info(`Récupération du festival avec succès`);
            res.json(festival);
        } catch (error) {
            logger.error(`Erreur lors de la récupération du festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération du dernier festival  :" + error });
        }
    },
    /**
     * Récupérer le festival suivant
     * @param req
     * @param res
     */
    getNextFestival : async (req: Request, res: Response) => {
        try {
            const festival = await festivalService.getNextFestival();
            logger.info(`Récupération du festival avec succès`);
            res.json(festival);
        } catch (error) {
            logger.error(`Erreur lors de la récupération du festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération du festival :" + error });
        }
    }
};

export default festivalController;