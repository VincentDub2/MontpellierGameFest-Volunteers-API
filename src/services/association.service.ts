/**
 * Ici, il y a toute la logique métier pour les associations
 */
import prisma from "../prisma";
import {logger} from "../helpers/loggers.vercel";

interface AssociationInterface {
    name: string;
    idAssociation?: number;
}

const associationService = {
    /**
     * Récupère toutes les associations avec pagination, recherche par nom
     * @param page
     * @param pageSize
     * @param name
     */
    getAllAssociations: async (page: number, pageSize: number, name?: string) => {
        const skip = (page - 1) * pageSize;
        const whereClause = name ? { name: { contains: name } } : {};

        try {
            const associations = await prisma.association.findMany({
                where: whereClause,
                skip: skip,
                take: pageSize,
            });
            logger.info(`Récupération des jeux avec succès`);
            return associations;

        } catch (error) {
            logger.error(`Erreur lors de la récupération des jeux: ${error}`);
        }
    },
    /**
     * Récupère une association par son id
     * @param id
     */
    getAssociationById: async (id: number) => {
        try {
            const association = await prisma.association.findUnique({
                where: {
                    idAssociation: id
                }
            });
            logger.info(`Récupération du jeu avec succès`);
            return association;
        } catch (error) {
            logger.error(`Erreur lors de la récupération du jeu: ${error}`);
        }
    },
    /**
     * Delete a game by its id
     * @param id
     */
    deleteAssociationById: async (id: number) => {
        try {
            const association = await prisma.association.delete({
                where: {
                    idAssociation: id
                }
            });
            logger.info(`Suppression du jeu avec succès`);
            return association;
        } catch (error) {
            logger.error(`Erreur lors de la suppression du jeu: ${error}`);
        }
    },
    /**
     * Créer une association
     * @param data
     */
    createAssociation: async (data: AssociationInterface) => {
        try {
            const associationCreated = await prisma.association.create({
                data: data
            });
            logger.info(`Association ${data.name} créée avec succès`);
            return associationCreated;
        } catch (error) {
            logger.error(`Erreur lors de la création de l'association ${data.name}:`, error);
        }
    },
    /**
     * Mettre à jour une association
     * @param data
     * @param id
     */
    updateAssociation: async (data: AssociationInterface, id: number) => {
        try {
            const associationUpdated = await prisma.association.update({
                where: {
                    idAssociation: id
                },
                data: data
            });
            logger.info(`Association ${data.name} mise à jour avec succès`);
            return associationUpdated;
        } catch (error) {
            logger.error(`Erreur lors de la mise à jour de l'association ${data.name}:`, error);
        }},

}

export default associationService;