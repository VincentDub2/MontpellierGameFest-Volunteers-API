import housingService from '../services/housing.service';
import {logger} from "../helpers/loggers.vercel";
import { Request, Response } from 'express';


const housingController = {
    /**
     * Ajouter un logement
     * @param req
     * @param res
     */
    addHousing: async (req: Request, res: Response) => {
        try {
            const {availibility, description, city, postalCode, idUser,isOffering} = req.body;
            if (!availibility || !description || !city || !postalCode || !idUser || !isOffering) {
                logger.error(`Erreur lors de l'ajout du logement: données manquantes`);
                return res.status(500).json({message: "Erreur lors de l'ajout du logement : données manquantes"});
            }
            const user = req.body.idUser;
            if (!user) {
                logger.error(`Erreur lors de l'ajout du logement: utilisateur non trouvé`);
                return res.status(500).json({message: "Erreur lors de l'ajout du logement : utilisateur non trouvé"});
            }

            const housing = await housingService.addHousing(availibility, description, city, postalCode, idUser,isOffering);
            logger.info(`Ajout du logement avec succès`);
            res.json(housing);
        } catch (error) {
            logger.error(`Erreur lors de l'ajout du logement: ${error}`);
            res.status(500).json({message: "Erreur lors de l'ajout du logement :" + error});

        }
    },
    /**
     * Récupérer tous les logements
     * @param req
     * @param res
     */
    getAllHousing: async (req: Request, res: Response) => {
        try {
            const housing = await housingService.getAllHousing();
            logger.info(`Récupération de tous les logements avec succès`);
            res.json(housing);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des logements: ${error}`);
            res.status(500).json({message: "Erreur lors de la récupération des logements :" + error});
        }
    },
    /**
     * Récupérer un logement par son id
     * @param req
     * @param res
     */
    getHousingById: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                logger.error(`Erreur lors de la récupération du logement: id invalide`);
                return res.status(500).json({message: "Erreur lors de la récupération du logement : id invalide"});
            }
            const housing = await housingService.getHousingById(id);
            logger.info(`Récupération du logement avec succès`);
            res.json(housing);
        } catch (error) {
            logger.error(`Erreur lors de la récupération du logement: ${error}`);
            res.status(500).json({message: "Erreur lors de la récupération du logement :" + error});
        }
    },
    /**
     * Supprimer un logement par son id
     * @param req
     * @param res
     */
    deleteHousingById: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                logger.error(`Erreur lors de la suppression du logement: id invalide`);
                return res.status(500).json({message: "Erreur lors de la suppression du logement : id invalide"});
            }
            const housing = await housingService.deleteHousingById(id);
            logger.info(`Suppression du logement avec succès`);
            res.json(housing);
        } catch (error) {
            logger.error(`Erreur lors de la suppression du logement: ${error}`);
            res.status(500).json({message: "Erreur lors de la suppression du logement :" + error});
        }
    }

}

export default housingController;