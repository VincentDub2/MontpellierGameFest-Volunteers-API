import { PrismaClient, PosteEspace } from '@prisma/client';

const prisma = new PrismaClient();

const posteEspaceService = {
    // Ajouter un nouveau PosteEspace
    addPosteEspace: async (idPoste: number, idEspace: number): Promise<PosteEspace | null> => {
        try {
            return await prisma.posteEspace.create({
                data: {
                    poste: {
                        connect: { idPoste }
                    },
                    espace: {
                        connect: { idEspace }
                    }
                },
            });
        } catch (error) {
            console.error(`Error adding posteEspace: ${error}`);
            return null;
        }
    },

    // Obtenir un PosteEspace par ses IDs
    getPosteEspaceById: async (idPoste: number, idEspace: number): Promise<PosteEspace | null> => {
        try {
            return await prisma.posteEspace.findUnique({
                where: {
                    idPoste_idEspace: {
                        idPoste,
                        idEspace
                    }
                },
                include: {
                    poste: true,
                    espace: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving posteEspace: ${error}`);
            return null;
        }
    },

    // Supprimer un PosteEspace
    deletePosteEspace: async (idPoste: number, idEspace: number): Promise<PosteEspace | null> => {
        try {
            return await prisma.posteEspace.delete({
                where: {
                    idPoste_idEspace: {
                        idPoste,
                        idEspace
                    }
                },
            });
        } catch (error) {
            console.error(`Error deleting posteEspace: ${error}`);
            return null;
        }
    },
};

export default posteEspaceService;
