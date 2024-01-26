/**
 * Ce fichier permet de gérer toute les réquetes liées aux festivals avec la base de données
 */
import prisma from "../prisma";
import {logger} from "../helpers/loggers.vercel";

interface FestivalInterface {
    name: string;
    address: string;
    dateDebut: Date;
    dateFin: Date;
    city: string;
    postalCode: string;
    country: string;
}


const festivalService = {
    /**
     * Créer un festival
     * @param data
     */
    createAFestival : async (data : FestivalInterface) => {
        try {
        const festivalCreated = await prisma.festival.create({
            data: data
        });
        logger.info(`Festival ${data.name} créé avec succès`);
        return festivalCreated;
        } catch (error) {
            throw new Error(`Erreur lors de la création du festival ${data.name}: ${error}`);
        }
    },
    /**
     * Récupérer tous les festivals
     */
    getAllFestivals : async () => {
        try {
            const festivals = await prisma.festival.findMany();
            logger.info(`Récupération des festivals avec succès`);
            return festivals;
        } catch (error) {
            logger.error(`Erreur lors de la récupération des festivals: ${error}`);
        }
    },
    /**
     * Récupérer un festival par son id
     * @param id
     */
    getFestivalById : async (id : number) => {
        try {
            const festival = await prisma.festival.findUnique({
                where: {
                    idFestival: id
                }
            });
            logger.info(`Récupération du festival avec succès`);
            return festival;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du festival: ${error}`);
        }
    },
    /**
     * Supprimer un festival par son id
     * @param id
     */
    deleteFestivalById : async (id : number) => {
        try {
            const festival = await prisma.festival.delete({
                where: {
                    idFestival: id
                }
            });
            logger.info(`Suppression du festival avec succès`);
            return festival;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du festival: ${error}`);
        }
    },
    /**
     * Mettre à jour un festival par son id
     * @param id
     * @param data
     */
    updateFestival : async (id : number, data : FestivalInterface) => {
        try {
            const festival = await prisma.festival.update({
                where: {
                    idFestival: id
                },
                data: data
            });
            logger.info(`Mise à jour du festival avec succès`);
            return festival;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du festival: ${error}`);
        }
    },
    /**
     * Get Active Festival
     */
    getActiveFestival : async () => {
        try {
            const festival = await prisma.festival.findMany({
                where: {
                    isActive : true
                }
            });
            logger.info(`Récupération des festivals actifs avec succès`);
            return festival;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des festivals actifs: ${error}`);
        }
    },
    /**
     * Get last festival created
     */
    getLastFestival : async () => {
        try {
            const festival = await prisma.festival.findFirst({
                orderBy: {
                    dateDebut: 'desc'
                },
                where : {
                    dateDebut: {
                        lt: new Date()
                    }
                }
            });
            logger.info(`Récupération du dernier festival créé avec succès`);
            return festival;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du dernier festival créé: ${error}`);
        }
    },
    getNextFestival : async () => {
        try {
            const festival = await prisma.festival.findFirst({
                orderBy: {
                    dateDebut: 'asc'
                },
                where : {
                    dateDebut: {
                        gt: new Date()
                    }
                }
            });
            logger.info(`Récupération du prochain festival créé avec succès`);
            return festival;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du prochain festival créé: ${error}`);
        }
    }
};


export default festivalService;