/**
 * Ce fichier contient les controllers pour les associations
 */
import { Request, Response } from "express";
import { logger } from "../helpers/loggers.vercel";
import associationService from "../services/association.service";


const associationController = {
    /**
     * Récupérer toutes les associations
     * @param req
     * @param res
     */
    getAllAssociations: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 20;
            const name = req.query.name as string | undefined;
            const associations = await associationService.getAllAssociations(page, pageSize, name);
            logger.info("Récupération de toutes les associations");
            res.json(associations);
        } catch (error) {
            logger.error(`Erreur lors de la récupération de toutes les associations: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération de toutes les associations" });
        }
    },
    /**
     * Récupérer une association par son ID
     * @param req
     * @param res
     */
    getAssociationById: async (req: Request, res: Response) => {
        try {
            const associationId = parseInt(req.params.id);
            const association = await associationService.getAssociationById(associationId);
            if (!association) {
                logger.warn(`Tentative de récupération d'une association avec l'ID: ${associationId} qui n'existe pas`);
                return res.status(404).json({ message: "Association non trouvée" });
            }
            logger.info(`Récupération de l'association avec l'ID: ${associationId}`);
            res.json(association);
        } catch (error) {
            logger.error(`Erreur lors de la récupération de l'association: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération de l'association" });
        }
    },
    /**
     * Créer une association
     * @param req
     * @param res
     */
    createAssociation: async (req: Request, res: Response) => {
        try {
            const association = await associationService.createAssociation(req.body.name);
            if (!association) {
                logger.warn(`Tentative de création d'une association avec le nom: ${req.body.name} qui existe déjà`);
                return res.status(409).json({ message: "Association déjà existante" });
            }
            logger.info(`Association créée avec l'ID: ${association.idAssociation}`);
            res.status(201).json(association);
        } catch (error) {
            logger.error(`Erreur lors de la création de l'association: ${error}`);
            res.status(500).json({ message: "Erreur lors de la création de l'association" });
        }
    },
    /**
     * Mettre à jour une association
     * @param req
     * @param res
     */
    updateAssociation: async (req: Request, res: Response) => {
        try {
            const associationId = parseInt(req.params.id);
            const association = await associationService.updateAssociation(req.body.name, associationId);
            if (!association) {
                logger.warn(`Tentative de mise à jour d'une association avec l'ID: ${associationId} qui n'existe pas`);
                return res.status(404).json({ message: "Association non trouvée" });
            }
            logger.info(`Association mise à jour avec l'ID: ${associationId}`);
            res.json(association);
        } catch (error) {
            logger.error(`Erreur lors de la mise à jour de l'association: ${error}`);
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'association" });
        }
    },
    /**
     * Supprimer une association
     * @param req
     * @param res
     */
    deleteAssociation: async (req: Request, res: Response) => {
        try {
            const associationId = parseInt(req.params.id);
            const association = await associationService.deleteAssociationById(associationId);
            if (!association) {
                logger.warn(`Tentative de suppression d'une association avec l'ID: ${associationId} qui n'existe pas`);
                return res.status(404).json({message: "Association non trouvée"});
            }
            logger.info(`Association supprimée avec l'ID: ${associationId}`);
            res.json(association);
        } catch (error) {
            logger.error(`Erreur lors de la suppression de l'association: ${error}`);
            res.status(500).json({message: "Erreur lors de la suppression de l'association"});
        }
    }
}

export default associationController;