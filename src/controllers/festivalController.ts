/**
 * Ce fichier permet de gérer les routes liées aux festivals
 */
import { Request, Response } from "express";
import festivalService from "../services/festivalService";


const festivalController = {
    /**
     * Créer un festival
     * @param req
     * @param res
     */
    createAFestival: async (req: Request, res: Response) => {
        try {
            const festival = await festivalService.createAFestival(req.body);
            res.json(festival);
        } catch (error) {
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
            res.json(festivals);
        } catch (error) {
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
            const festival = await festivalService.getFestivalById(id);
            res.json(festival);
        } catch (error) {
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
            res.json(festival);
        } catch (error) {
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
            res.json(festival);
        } catch (error) {
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
            res.json(festival);
        } catch (error) {
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
            res.json(festival);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du festival :" + error });
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
            res.json(festival);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du festival :" + error });
        }
    }
};

export default festivalController;