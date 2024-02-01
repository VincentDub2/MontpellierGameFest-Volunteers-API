import { Request, Response } from 'express';
import volunteerToFestivalService from "../services/volunteerToFestival.service";
import { VolunteerInterface } from "../types/types";
import { logger } from "../helpers/loggers.vercel";
import {IsVolunteer, Role} from '@prisma/client';

const volunteerToFestivalController = {
    /**
     * Ajoute un volontaire à un festival
     */
    addVolunteerToFestival: async (req: Request, res: Response) => {
        try {
            const volunteer: IsVolunteer = req.body;
            if (!volunteer) {
                logger.warn(`Erreur lors de l'ajout du volontaire au festival: données du volontaire manquantes`);
                return res.status(400).json({ message: "Données du volontaire manquantes" });
            }

            const result = await volunteerToFestivalService.addVolunteerToFestival(volunteer);
            res.json(result);
        } catch (error) {
            logger.error(`Erreur lors de l'ajout du volontaire au festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de l'ajout du volontaire au festival" });
        }
    },

    /**
     * Supprime un volontaire d'un festival
     */
    deleteVolunteerToFestival: async (req: Request, res: Response) => {
        try {
            const { volunteerId, festivalId } = req.params;

            if (!volunteerId || !festivalId) {
                logger.warn(`Erreur lors de la suppression du volontaire au festival: Veuillez renseigner l'identifiant du volontaire et du festival`);
                return res.status(400).json({ message: "Veuillez renseigner l'identifiant du volontaire et du festival" });
            }

            const result = await volunteerToFestivalService.deleteVolunteerToFestival(volunteerId, parseInt(festivalId));
            res.json(result);
        } catch (error) {
            logger.error(`Erreur lors de la suppression du volontaire au festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la suppression du volontaire au festival" });
        }
    },
    // Autres méthodes (getVolunteerToFestival, getVolunteersToFestival, updateVolunteerToFestival)
    getVolunteerToFestival: async (req: Request, res: Response) => {
        try {
            const { volunteerId, festivalId } = req.params;

            if (!volunteerId || !festivalId) {
                logger.warn(`Erreur lors de la récupération du volontaire au festival: Veuillez renseigner l'identifiant du volontaire et du festival`);
                return res.status(400).json({ message: "Veuillez renseigner l'identifiant du volontaire et du festival" });
            }

            const result = await volunteerToFestivalService.getVolunteerToFestival(volunteerId, parseInt(festivalId));
            res.json(result);
        } catch (error) {
            logger.error(`Erreur lors de la récupération du volontaire au festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération du volontaire au festival" });
        }
    },

    /**
     * Récupère tous les volontaires d'un festival
     * @param req
     * @param res
     * @returns
     * 
    */
    getVolunteersToFestival: async (req: Request, res: Response) => {
        try {
            const { festivalId } = req.params;
            const {role, name } = req.query;

            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 20;
            
            if (!festivalId) {
                logger.warn(`Erreur lors de la récupération des volontaires au festival: Veuillez renseigner l'identifiant du festival`);
                return res.status(400).json({ message: "Veuillez renseigner l'identifiant du festival" });
            }

            // Validation du rôle
            if (role && !Object.values(Role).includes(role as Role)) {
                logger.warn(`Erreur lors de la récupération des volontaires au festival: Le rôle renseigné n'est pas valide`);
                return res.status(400).json({ message: "Le rôle renseigné n'est pas valide" });
            }

            const result = await volunteerToFestivalService.getVolunteersToFestival(
                parseInt(festivalId), 
                page,
                pageSize,
                role as Role, 
                name as string
            );
            res.json(result);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des volontaires au festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération des volontaires au festival" });
        }
    },
    /**
     * Met à jour un volontaire d'un festival
     * @param req
     * @param res
     * @returns
     */
    updateVolunteerToFestival: async (req: Request, res: Response) => {
        try {
            const { festivalId, volunteerId } = req.params; // Assurez-vous que ces paramètres sont correctement définis dans votre route
            const { isVege, sizeTeeShirt, role } = req.body;

            // Validation des données (ajoutez plus de validations si nécessaire)
            if (!festivalId || !volunteerId) {
                logger.warn(`Erreur lors de la mise à jour du volontaire au festival: L'identifiant du festival et du volontaire sont requis`);
                return res.status(400).json({ message: "L'identifiant du festival et du volontaire sont requis" });
            }

            if (role && !Object.values(Role).includes(role as Role)) {
                logger.warn(`Erreur lors de la mise à jour du volontaire au festival: Le rôle renseigné n'est pas valide`);
                return res.status(400).json({ message: "Le rôle renseigné n'est pas valide" });
            }

            const volunteerData: VolunteerInterface = {
                festivalId: parseInt(festivalId),
                volunteerId,
                isVege,
                sizeTeeShirt,
                role: role as Role
            };

            const result = await volunteerToFestivalService.updateVolunteerToFestival(volunteerData);
            res.json(result);
        } catch (error) {
            logger.error(`Erreur lors de la mise à jour du volontaire au festival: ${error}`);
            res.status(500).json({ message: "Erreur lors de la mise à jour du volontaire au festival" });
        }
    },
    //route pour recuperer les festivales au quel un volontaire est inscrit ou a participé
    //volunteerId: string, page: number, pageSize: number, role?: Role,startDate : Date, endDate : Date
    getFestivalsByVolunteer: async (req: Request, res: Response) => {
        try {
            const { volunteerId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 20;
            const role = req.query.role as string | undefined;
            const startDate = req.query.startDate as string | undefined;
            const endDate = req.query.endDate as string | undefined;
            
            if (!volunteerId) {
                logger.warn(`Erreur lors de la récupération des festivals au quel un volontaire est inscrit ou a participé: Veuillez renseigner l'identifiant du volontaire`);
                return res.status(400).json({ message: "Veuillez renseigner l'identifiant du volontaire" });
            }
            if (role && !Object.values(Role).includes(role as Role)) {
                logger.warn(`Erreur lors de la mise à jour du volontaire au festival: Le rôle renseigné n'est pas valide`);
                return res.status(400).json({ message: "Le rôle renseigné n'est pas valide" });
            }

            // Validation des dates
            let parsedStartDate: Date | undefined = undefined;
            let parsedEndDate: Date | undefined = undefined;

            if (typeof startDate === 'string') {
                parsedStartDate = new Date(startDate);
            }

            if (typeof endDate === 'string') {
                parsedEndDate = new Date(endDate);
            }

            const result = await volunteerToFestivalService.getFestivalsByVolunteer(
                volunteerId, 
                page ,
                pageSize,
                role as Role,
                parsedEndDate,
                parsedStartDate
            );
            res.json(result);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des festivals au quel un volontaire est inscrit ou a participé: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération des festivals au quel un volontaire est inscrit ou a participé" });
        }
    },

};

export default volunteerToFestivalController;
