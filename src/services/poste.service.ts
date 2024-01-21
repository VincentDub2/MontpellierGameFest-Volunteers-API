import { PrismaClient, Poste } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { get } from 'lodash';

const prisma = new PrismaClient();

const posteService = {
    // Ajouter un nouveau poste
    addPoste: async (name: string, capacityPoste: number, idFestival: number): Promise<Poste | null> => {
        try {
            return await prisma.poste.create({
                data: {
                    name,
                    capacityPoste,
                    idFestival
                },
            });
        } catch (error) {
            console.error(`Error adding poste: ${error}`);
            return null;
        }
    },addMultiplePostes: async (postesData: Prisma.PosteCreateManyInput[]): Promise<Prisma.BatchPayload> => {
        try {
            return await prisma.poste.createMany({
                data: postesData,
            });
        } catch (error) {
            console.error(`Error adding multiple postes: ${error}`);
            throw error; // ou retourner null selon votre gestion d'erreur
        }
    },
    // Obtenir un poste par son ID
    getPosteById: async (idPoste: number): Promise<Poste | null> => {
        try {
            return await prisma.poste.findUnique({
                where: { idPoste },
            });
        } catch (error) {
            console.error(`Error retrieving poste: ${error}`);
            return null;
        }
    },

    getAllPostesByFestival: async (idFestival: number, name?: string): Promise<Poste[] | null> => {
        try {
            let whereClause: { idFestival: number; name?: string } = { idFestival };
    
            if (name) {
                whereClause.name = name;
            }
    
            return await prisma.poste.findMany({
                where: whereClause,
            });
        } catch (error) {
            console.error(`Error retrieving postes for festival: ${error}`);
            return null;
        }
    },

    // Mettre à jour un poste
    updatePoste: async (idPoste: number, name?: string, capacityPoste?: number): Promise<Poste | null> => {
        try {
            return await prisma.poste.update({
                where: { idPoste },
                data: {
                    name,
                    capacityPoste
                },
            });
        } catch (error) {
            console.error(`Error updating poste: ${error}`);
            return null;
        }
    },

    // Supprimer un poste
    deletePoste: async (idPoste: number): Promise<Poste | null> => {
        try {
            return await prisma.poste.delete({
                where: { idPoste },
            });
        } catch (error) {
            console.error(`Error deleting poste: ${error}`);
            return null;
        }
    }
};

export default posteService;