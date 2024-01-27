import { PrismaClient, CreneauEspace } from '@prisma/client';

const prisma = new PrismaClient();

const creneauEspaceService = {
    // Ajouter un nouveau CreneauEspace
    addCreneauEspace: async (idCreneau: number, idEspace: number, capacityEspace: number): Promise<CreneauEspace | null> => {
        try {
            return await prisma.creneauEspace.create({
                data: {
                    idCreneau,
                    idEspace,
                    capacityEspace
                },
            });
        } catch (error) {
            console.error(`Error adding CreneauEspace: ${error}`);
            return null;
        }
    },

    // Obtenir un CreneauEspace par son ID
    getCreneauEspaceById: async (idCreneauEspace: number): Promise<CreneauEspace | null> => {
        try {
            return await prisma.creneauEspace.findUnique({
                where: { idCreneauEspace },
                include: {
                    creneau: true,
                    espace: true,
                    inscriptions: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving CreneauEspace: ${error}`);
            return null;
        }
    },

    // Obtenir tous les CreneauEspaces
    getAllCreneauEspaces: async (): Promise<CreneauEspace[] | null> => {
        try {
            return await prisma.creneauEspace.findMany({
                include: {
                    creneau: true,
                    espace: true,
                    inscriptions: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving all CreneauEspaces: ${error}`);
            return null;
        }
    },

    // Mettre à jour un CreneauEspace
    updateCreneauEspace: async (idCreneauEspace: number, capacityEspace: number): Promise<CreneauEspace | null> => {
        try {
            return await prisma.creneauEspace.update({
                where: { idCreneauEspace },
                data: { capacityEspace }
            });
        } catch (error) {
            console.error(`Error updating CreneauEspace: ${error}`);
            return null;
        }
    },

    // Supprimer un CreneauEspace
    deleteCreneauEspace: async (idCreneauEspace: number): Promise<CreneauEspace | null> => {
        try {
            return await prisma.creneauEspace.delete({
                where: { idCreneauEspace }
            });
        } catch (error) {
            console.error(`Error deleting CreneauEspace: ${error}`);
            return null;
        }
    }
};

export default creneauEspaceService;
