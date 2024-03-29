import { PrismaClient, IsPlay } from '@prisma/client';
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient();

const isPlayService = {
    // Ajouter un jeu joué à un festival
    addPlay: async (idGame: number, idFestival: number, idEspace: number): Promise<IsPlay | null> => {
        try {
            return await prisma.isPlay.create({
                data: {
                    idGame,
                    idFestival,
                    idEspace
                }
            });
        } catch (error) {
            console.error(`Error adding play: ${error}`);
            return null;
        }
    },

    // Ajouter plusieurs jeux joués à un festival
    addMultiplePlays: async (playsData: Prisma.IsPlayCreateManyInput[]): Promise<Prisma.BatchPayload> => {
        try {
            // Handle duplicates by ingore existing entries
            return await prisma.isPlay.createMany({
                data: playsData,
                skipDuplicates: true
            });
        } catch (error) {
            console.error(`Error adding multiple isPlay: ${error}`);
            throw new Error(`Error adding multiple isPlay: ${error}`);
        }
    },

    // Obtenir tous les jeux joués d'un espace à un festival
    getPlaysById: async (idEspace: number, idFestival: number): Promise<IsPlay[] | null> => {
        try {
            return await prisma.isPlay.findMany({
                where: {
                    idEspace,
                    idFestival,
                },
                include: {
                    game: true,
                },
            });
        } catch (error) {
            console.error(`Error retrieving play: ${error}`);
            return null;
        }
    },

    // Supprimer un jeu joué
    deletePlay: async (idGame: number, idFestival: number, idEspace: number): Promise<IsPlay | null> => {
        try {
            return await prisma.isPlay.delete({
                where: {
                    idGame_idFestival_idEspace: {
                        idGame,
                        idFestival,
                        idEspace
                    }
                }
            });
        } catch (error) {
            console.error(`Error deleting play: ${error}`);
            return null;
        }
    },

    // Autres méthodes selon les besoins...
};

export default isPlayService;
