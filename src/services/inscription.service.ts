import { PrismaClient, Inscription } from '@prisma/client';

const prisma = new PrismaClient();

const inscriptionService = {
    // Ajouter une nouvelle inscription
    addInscription: async (
        idUser: string,
        idCreneauEspace: number,
        isAccepted: boolean,
        isFlexible: boolean,
        jeuxIdGame?: number
    ): Promise<Inscription | null> => {
        try {
            const data: any = {
                idUser,
                idCreneauEspace,
                isAccepted,
                isFlexible
            };

            if (jeuxIdGame) {
                data.Jeux = { connect: { idGame: jeuxIdGame } };
            }

            return await prisma.inscription.create({ data });
        } catch (error) {
            console.error(`Error adding Inscription: ${error}`);
            return null;
        }
    },


    // Obtenir une inscription par ID
    getInscriptionById: async (idUser: string, idCreneauEspace: number): Promise<Inscription | null> => {
        try {
            return await prisma.inscription.findUnique({
                where: {
                    idUser_idCreneauEspace: {
                        idUser,
                        idCreneauEspace
                    }
                },
                include: {
                    user: true,
                    creneauEspace: true,
                    Jeux: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving Inscription: ${error}`);
            return null;
        }
    },

    // Mettre à jour une inscription
    updateInscription: async (idUser: string, idCreneauEspace: number, isAccepted: boolean, isFlexible: boolean, jeuxIdGame?: number): Promise<Inscription | null> => {
        try {
            return await prisma.inscription.update({
                where: {
                    idUser_idCreneauEspace: {
                        idUser,
                        idCreneauEspace
                    }
                },
                data: {
                    isAccepted,
                    isFlexible,
                    ...(jeuxIdGame && {
                        Jeux: {
                            connect: { idGame: jeuxIdGame }
                        }
                    })
                }
            });
        } catch (error) {
            console.error(`Error updating Inscription: ${error}`);
            return null;
        }
    },

    // Supprimer une inscription
    deleteInscription: async (idUser: string, idCreneauEspace: number): Promise<Inscription | null> => {
        try {
            return await prisma.inscription.delete({
                where: {
                    idUser_idCreneauEspace: {
                        idUser,
                        idCreneauEspace
                    }
                }
            });
        } catch (error) {
            console.error(`Error deleting Inscription: ${error}`);
            return null;
        }
    },

    // Autres méthodes selon les besoins...
};

export default inscriptionService;
