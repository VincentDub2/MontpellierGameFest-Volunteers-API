import { PrismaClient, IsPresent } from '@prisma/client';

const prisma = new PrismaClient();

const isPresentService = {
    // Ajouter une présence
    addPresence: async (
        idFestival: number,
        idUser: string,
        date: Date,
        jeuxIdGame?: number
    ): Promise<IsPresent | null> => {
        try {
            const data: any = {
                idFestival,
                idUser,
                date
            };

            if (jeuxIdGame) {
                data.Jeux = { connect: { idGame: jeuxIdGame } };
            }

            return await prisma.isPresent.create({ data });
        } catch (error) {
            console.error(`Error adding presence: ${error}`);
            return null;
        }
    },

    // Obtenir une présence par ID
    getPresenceById: async (idFestival: number, idUser: string, date: Date): Promise<IsPresent | null> => {
        try {
            return await prisma.isPresent.findUnique({
                where: {
                    idFestival_idUser_date: {
                        idFestival,
                        idUser,
                        date
                    }
                },
                include: {
                    user: true,
                    festival: true,
                    Jeux: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving presence: ${error}`);
            return null;
        }
    },

    // Mettre à jour une présence
    updatePresence: async (idFestival: number, idUser: string, date: Date, jeuxIdGame?: number): Promise<IsPresent | null> => {
        try {
            return await prisma.isPresent.update({
                where: {
                    idFestival_idUser_date: {
                        idFestival,
                        idUser,
                        date
                    }
                },
                data: {
                    ...(jeuxIdGame && {
                        Jeux: {
                            connect: { idGame: jeuxIdGame }
                        }
                    })
                }
            });
        } catch (error) {
            console.error(`Error updating presence: ${error}`);
            return null;
        }
    },

    // Supprimer une présence
    deletePresence: async (idFestival: number, idUser: string, date: Date): Promise<IsPresent | null> => {
        try {
            return await prisma.isPresent.delete({
                where: {
                    idFestival_idUser_date: {
                        idFestival,
                        idUser,
                        date
                    }
                }
            });
        } catch (error) {
            console.error(`Error deleting presence: ${error}`);
            return null;
        }
    },

    // Autres méthodes selon les besoins...
};

export default isPresentService;
