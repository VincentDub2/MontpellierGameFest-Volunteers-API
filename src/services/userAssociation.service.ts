/**
 * Ce service permet de gérer les associations entre les utilisateurs et les groupes
 */
import {logger} from "../helpers/loggers.vercel";
import prisma from "../prisma";

const userAssociationService = {
    addUserToAssociation: async (userId: string, associationId: number) => {
        try {
            const userAssociation = await prisma.userAssociation.create({
                data: {
                    idUser: userId,
                    idAssociation: associationId
                }
            });
            logger.info(`Ajout de l'utilisateur à l'association avec succès`);
            return userAssociation;
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout de l'utilisateur à l'association: ${error}`);
        }
    },
    /**
     * Cette methode permet de récupérer toutes les associations d'un utilisateur
     * @param userId
     */
    getUserAssociations: async (userId: string) => {
        try {
            const userAssociations = await prisma.userAssociation.findMany({
                where: {
                    idUser: userId
                },
                include: {
                    association: true
                }
            });
            logger.info(`Récupération des associations de l'utilisateur avec succès`);
            return userAssociations;
        } catch (error) {
           throw new Error(`Erreur lors de la récupération des associations de l'utilisateur: ${error}`);
        }
    },
    /**
     * Cette methode permet de supprimer une association entre un utilisateur et un groupe
     * @param userId
     * @param associationId
     */
    deleteUserAssociation: async (userId: string, associationId: number) => {
        try {
            const userAssociation = await prisma.userAssociation.deleteMany({
                where: {
                    idUser: userId,
                    idAssociation: associationId
                }
            });
            logger.info(`Suppression de l'association entre l'utilisateur et le groupe avec succès`);
            return userAssociation;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression de l'association entre l'utilisateur et le groupe: ${error}`);
        }
    },
    /**
     * Cette methode permet de récupérer tous les utilisateurs d'une association
     * @param associationId
     */
    getAssociationUsers: async (associationId: number) => {
        try {
            const users = await prisma.userAssociation.findMany({
                where: {
                    idAssociation: associationId
                },
                include: {
                    user: true
                }
            });
            logger.info(`Récupération des utilisateurs de l'association avec succès`);
            return users;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des utilisateurs de l'association: ${error}`);
        }
    }
}

export default userAssociationService;