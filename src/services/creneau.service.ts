import {PrismaClient, Creneau, Prisma} from '@prisma/client';

const prisma = new PrismaClient();

const creneauService = {
    // Ajouter un nouveau créneau
    addCreneau: async (timeStart: Date, timeEnd: Date, idFestival: number): Promise<Creneau | null> => {
        try {
            return await prisma.creneau.create({
                data: {
                    timeStart,
                    timeEnd,
                    festival: {
                        connect: { idFestival }
                    }
                },
            });
        } catch (error) {
            throw new Error(`Error adding creneau: ${error}`);
        }
    },
    //Add plusieurs creneaux
    addMultipleCreneaux: async (creneauxData: Prisma.CreneauCreateManyInput[]): Promise<Prisma.BatchPayload> => {
    try {
        return await prisma.creneau.createMany({
            data: creneauxData,
            }
        );
    } catch (error) {
        throw new Error(`Error adding multiple creneaux: ${error}`);
    }
},
    // Obtenir un créneau par son ID
    getCreneauById: async (idCreneau: number): Promise<Creneau | null> => {
        try {
            return await prisma.creneau.findUnique({
                where: { idCreneau },
                include: {
                    festival: true, // Inclut les détails du festival
                    creneauEspace: true // Inclut les espaces associés au créneau
                }
            });
        } catch (error) {
            throw new Error(`Error retrieving creneau: ${error}`);
        }
    },

    // Obtenir tous les créneaux pour un festival donné
    getAllCreneauxByFestival: async (
        idFestival: number,
        timeStart?: Date,
        timeEnd?: Date,
        idEspace?: number,
        idPoste?: number
    ): Promise<Creneau[] | null> => {
        try {
            let whereClause: any = {
                idFestival,
                ...(timeStart && { timeStart: { gte: timeStart } }),
                ...(timeEnd && { timeEnd: { lte: timeEnd } })
            };

            if (idEspace || idPoste) {
                whereClause.creneauEspace = {
                    some: {
                        ...(idEspace && { idEspace }),
                        espace: {
                            ...(idPoste && {
                                posteEspaces: {
                                    some: { idPoste }
                                }
                            })
                        }
                    }
                };
            }


            console.log("Where",whereClause)
    
            return await prisma.creneau.findMany({
                where: whereClause,
                include: {
                    creneauEspace: {
                        include: {
                            espace: {
                                include: {
                                    posteEspaces: true
                                }
                            }
                        }
                    },
                }
            });
        } catch (error) {
            throw new Error(`Error retrieving creneaux: ${error}`);
        }
    },
    

    // Mettre à jour un créneau
    updateCreneau: async (idCreneau: number, timeStart?: Date, timeEnd?: Date): Promise<Creneau | null> => {
        try {
            return await prisma.creneau.update({
                where: { idCreneau },
                data: {
                    timeStart,
                    timeEnd
                },
            });
        } catch (error) {
           throw new Error(`Error updating creneau: ${error}`);
        }
    },

    // Supprimer un créneau
    deleteCreneau: async (idCreneau: number): Promise<Creneau | null> => {
        try {
            return await prisma.creneau.delete({
                where: { idCreneau },
            });
        } catch (error) {
            throw new Error(`Error deleting creneau: ${error}`);
        }
    },
    // Avoir les creneaux d'un user d'un festival
    getCreneauxByUser: async (idUser: string, idFestival: number): Promise<Creneau[] | null> => {
        try {
            // Supposons que chaque 'Inscription' relie un 'User' à un 'CreneauEspace', et indirectement à un 'Creneau'
            // Cela nécessite que votre logique métier établisse cette connexion.
            const inscriptions = await prisma.inscription.findMany({
                where: {
                    user: {
                        id: idUser
                    },
                    creneauEspace: {
                        creneau: {
                            idFestival: idFestival
                        }
                    }
                },
                include: {
                    creneauEspace: {
                        include: {
                            creneau: true // Inclut les détails du créneau
                        }
                    }
                }
            });

            // Extraire les créneaux à partir des inscriptions
            const creneaux = inscriptions.map(inscription => inscription.creneauEspace.creneau);

            return creneaux;
        } catch (error) {
            throw new Error(`Error retrieving creneaux: ${error}`);
        }
    }
};

export default creneauService;
