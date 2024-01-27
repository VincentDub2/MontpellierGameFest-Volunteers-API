import { PrismaClient, IsReferent } from '@prisma/client';

const prisma = new PrismaClient();

const isReferentService = {
    // Ajouter un nouveau référent
    addReferent: async (idUser: string, idEspace: number, jeuxIdGame?: number): Promise<IsReferent | null> => {
        try {
            return await prisma.isReferent.create({
                data: {
                    user: {
                        connect: { id: idUser }
                    },
                    espace: {
                        connect: { idEspace }
                    },
                    ...(jeuxIdGame && {
                        Jeux: {
                            connect: { idGame: jeuxIdGame }
                        }
                    })
                },
            });
        } catch (error) {
            console.error(`Error adding referent: ${error}`);
            return null;
        }
    },

    // Obtenir un référent par l'ID de l'utilisateur et de l'espace
    getReferentById: async (idUser: string, idEspace: number): Promise<IsReferent | null> => {
        try {
            return await prisma.isReferent.findUnique({
                where: {
                    idUser_idEspace: {
                        idUser,
                        idEspace
                    }
                },
                include: {
                    user: true,
                    espace: true,
                    Jeux: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving referent: ${error}`);
            return null;
        }
    },

    // Supprimer un référent
    deleteReferent: async (idUser: string, idEspace: number): Promise<IsReferent | null> => {
        try {
            return await prisma.isReferent.delete({
                where: {
                    idUser_idEspace: {
                        idUser,
                        idEspace
                    }
                },
            });
        } catch (error) {
            console.error(`Error deleting referent: ${error}`);
            return null;
        }
    },updateReferent: async (idUser: string, idEspace: number, jeuxIdGame?: number): Promise<IsReferent | null> => {
        try {
            return await prisma.isReferent.update({
                where: {
                    idUser_idEspace: {
                        idUser,
                        idEspace
                    }
                },
                data: {
                    ...(jeuxIdGame && {
                        Jeux: {
                            connect: {idGame: jeuxIdGame}
                        }
                    })
                }
            });
        } catch (error) {
            console.error(`Error updating referent: ${error}`);
            return null;
        }
    }

    // Autres méthodes du service (mise à jour, récupération de tous les référents, etc.) selon vos besoins
};

export default isReferentService;
