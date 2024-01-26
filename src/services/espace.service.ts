import { PrismaClient, Espace } from '@prisma/client';

const prisma = new PrismaClient();

const espaceService = {
    // Ajouter un nouvel espace
    addEspace: async (name: string): Promise<Espace | null> => {
        try {
            return await prisma.espace.create({
                data: {
                    name
                },
            });
        } catch (error) {
            console.error(`Error adding espace: ${error}`);
            return null;
        }
    },

    // Obtenir un espace par son ID
    getEspaceById: async (idEspace: number): Promise<Espace | null> => {
        try {
            return await prisma.espace.findUnique({
                where: { idEspace },
                include: {
                    posteEspaces: true,
                    creneauEspaces: true,
                    isReferent: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving espace: ${error}`);
            return null;
        }
    },

    // Obtenir tous les espaces
    getAllEspaces: async (): Promise<Espace[] | null> => {
        try {
            return await prisma.espace.findMany({
                include: {
                    posteEspaces: true,
                    creneauEspaces: true,
                    isReferent: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving all espaces: ${error}`);
            return null;
        }
    },

    // Mettre à jour un espace
    updateEspace: async (idEspace: number, name?: string): Promise<Espace | null> => {
        try {
            return await prisma.espace.update({
                where: { idEspace },
                data: {
                    name
                },
            });
        } catch (error) {
            console.error(`Error updating espace: ${error}`);
            return null;
        }
    },

    // Supprimer un espace
    deleteEspace: async (idEspace: number): Promise<Espace | null> => {
        try {
            return await prisma.espace.delete({
                where: { idEspace },
            });
        } catch (error) {
            console.error(`Error deleting espace: ${error}`);
            return null;
        }
    },
};

export default espaceService;
