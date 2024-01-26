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
                ...(timeEnd && { timeEnd: { lte: timeEnd } }),
                creneauEspace: {
                    some: {
                        ...(idEspace && { idEspace }),
                        espace: {
                            posteEspaces: {
                                some: {
                                    ...(idPoste && { idPoste })
                                }
                            }
                        }
                    }
                }
            };
    
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
                    festival: true
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
};

export default creneauService;
