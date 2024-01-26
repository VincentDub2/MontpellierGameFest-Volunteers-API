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
            throw new Error(`Error adding poste: ${error}`);
        }
    },addMultiplePostes: async (postesData: Prisma.PosteCreateManyInput[]): Promise<Prisma.BatchPayload> => {
        try {
            return await prisma.poste.createMany({
                data: postesData,
            });
        } catch (error) {
            console.error(`Error adding multiple postes: ${error}`);
            throw new Error(`Error adding multiple postes: ${error}`);
        }
    },
    // Obtenir un poste par son ID
    getPosteById: async (idPoste: number): Promise<Poste | null> => {
        try {
            return await prisma.poste.findUnique({
                where: { idPoste },
            });
        } catch (error) {
            throw new Error(`Error retrieving poste: ${error}`);
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
            throw new Error(`Error retrieving postes: ${error}`);
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
            throw new Error(`Error updating poste: ${error}`);
        }
    },

    // Supprimer un poste
    deletePoste: async (idPoste: number): Promise<Poste | null> => {
        try {
            return await prisma.poste.delete({
                where: { idPoste },
            });
        } catch (error) {
            throw new Error(`Error deleting poste: ${error}`);
        }
    }
};

export default posteService;