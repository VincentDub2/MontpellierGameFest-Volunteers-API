import { PrismaClient, IsPresented } from '@prisma/client';

const prisma = new PrismaClient();

const isPresentedService = {
    // Ajouter une présentation
    addPresentation: async (idGame: number, idEvent: number): Promise<IsPresented | null> => {
        try {
            return await prisma.isPresented.create({
                data: {
                    idGame,
                    idEvent,
                }
            });
        } catch (error) {
            console.error(`Error adding presentation: ${error}`);
            return null;
        }
    },

    // Obtenir une présentation par ID
    getPresentationById: async (idGame: number, idEvent: number): Promise<IsPresented | null> => {
        try {
            return await prisma.isPresented.findUnique({
                where: {
                    idGame_idEvent: {
                        idGame,
                        idEvent,
                    }
                },
                include: {
                    game: true,
                    event: true
                }
            });
        } catch (error) {
            console.error(`Error retrieving presentation: ${error}`);
            return null;
        }
    },

    // Mettre à jour une présentation
    updatePresentation: async (idGame: number, idEvent: number, newIdGame?: number, newIdEvent?: number): Promise<IsPresented | null> => {
        try {
            const updateData: any = {};
            if (newIdGame) updateData.idGame = newIdGame;
            if (newIdEvent) updateData.idEvent = newIdEvent;

            return await prisma.isPresented.update({
                where: {
                    idGame_idEvent: {
                        idGame,
                        idEvent,
                    }
                },
                data: updateData
            });
        } catch (error) {
            console.error(`Error updating presentation: ${error}`);
            return null;
        }
    },

    // Supprimer une présentation
    deletePresentation: async (idGame: number, idEvent: number): Promise<IsPresented | null> => {
        try {
            return await prisma.isPresented.delete({
                where: {
                    idGame_idEvent: {
                        idGame,
                        idEvent,
                    }
                }
            });
        } catch (error) {
            console.error(`Error deleting presentation: ${error}`);
            return null;
        }
    },

    // Autres méthodes selon les besoins...
};

export default isPresentedService;
