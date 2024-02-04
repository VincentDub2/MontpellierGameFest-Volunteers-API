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
           throw new Error(`Error adding Inscription: ${error}`);
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
            throw new Error(`Error retrieving Inscription: ${error}`);
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
          throw new Error(`Error updating Inscription: ${error}`);
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
            throw new Error(`Error deleting Inscription: ${error}`);
        }
    },
    //Obtenir toutes les inscriptions d'un utilisateur a un festival
    getAllInscriptionsByUser: async (idUser: string, idFestival: number): Promise<Inscription[] | null> => {
        try {
            // Étape 1: Récupérer les ID CreneauEspace pour un idFestival donné
            const creneauEspaces = await prisma.creneauEspace.findMany({
                where: {
                    creneau: {
                        idFestival: idFestival,
                    }
                },
                select: {
                    idCreneauEspace: true, // Sélectionnez seulement les idCreneauEspace
                }
            });
            const creneauEspaceIds = creneauEspaces.map(ce => ce.idCreneauEspace);

            // Étape 2: Utiliser les ID CreneauEspace récupérés pour filtrer les inscriptions de l'utilisateur
            const inscriptions = await prisma.inscription.findMany({
                where: {
                    idUser: idUser,
                    idCreneauEspace: {
                        in: creneauEspaceIds, // Filtre par les ID CreneauEspace
                    },
                },
                include: {
                    creneauEspace: {
                        include: {
                            creneau: true, // Incluez les détails du créneau si nécessaire
                            espace: true, // Incluez les détails de l'espace si nécessaire
                        }
                    },
                }
            });

            return inscriptions;
        } catch (error) {
            throw new Error(`Error retrieving all Inscriptions: ${error}`);
        }
    },
    //Obtenir toutes les inscriptions
    getAllInscriptions: async (): Promise<Inscription[] | null> => {
        try {
            return await prisma.inscription.findMany();
        } catch (error) {
            throw new Error(`Error retrieving all Inscriptions: ${error}`);
        }
    },



};

export default inscriptionService;
