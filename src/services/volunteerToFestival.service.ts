import prisma from "../prisma";
import {logger} from "../helpers/loggers.vercel";
import {Role} from "@prisma/client";
import {VolunteerInterface} from "../types/types";

const volunteerToFestivalService = {
    /**
     * @param volunteer
     */
    addVolunteerToFestival: async ( volunteer : VolunteerInterface)=> {
        try {
            const {volunteerId, festivalId, isVege, sizeTeeShirt, role} = volunteer;
            if (isVege === undefined || sizeTeeShirt === undefined || role === undefined) {
                logger.warn(`Erreur lors de l'ajout du volontaire au festival: Veuillez renseigner l'identifiant du volontaire, du festival, le role, la taille du t-shirt et si il est végétarien`);
                return { message: "Veuillez renseigner l'identifiant du volontaire, du festival, le role, la taille du t-shirt et si il est végétarien" };
            }
            const volunteerToFestival = await prisma.isVolunteer.create({
                data: {
                    idUser: volunteerId,
                    idFestival: festivalId,
                    isVege,
                    sizeTeeShirt,
                    role
                }
            });
            logger.info(`Ajout du volontaire au festival avec succès`);
            return volunteerToFestival;
        } catch (error) {
            logger.error(`Erreur lors de l'ajout du volontaire au festival: ${error}`);
        }
    },
    /**
     * @param volunteerId
     * @param festivalId
     */
    deleteVolunteerToFestival: async (volunteerId: string, festivalId: number) => {
        try {
            const volunteerToFestival = await prisma.isVolunteer.deleteMany({
                where: {
                    idUser: volunteerId,
                    idFestival: festivalId
                }
            });
            logger.info(`Suppression du volontaire au festival avec succès`);
            return volunteerToFestival;
        } catch (error) {
            logger.error(`Erreur lors de la suppression du volontaire au festival: ${error}`);
        }
    },
    /**
     * Permet de récupérer un volontaire à un festival
     * @param volunteerId
     * @param festivalId
     */
    getVolunteerToFestival: async (volunteerId: string, festivalId: number) => {
        try {
            const volunteerToFestival = await prisma.isVolunteer.findMany({
                where: {
                    idUser: volunteerId,
                    idFestival: festivalId
                }
            });
            logger.info(`Récupération du volontaire au festival avec succès`);
            return volunteerToFestival;
        } catch (error) {
            logger.error(`Erreur lors de la récupération du volontaire au festival: ${error}`);
        }
    },
    /**
     * Permet de récupérer tous les volontaires à un festival avec comment paramètre optionnel le role et le nom
     * @param festivalId
     * @param page
     * @param pageSize
     * @param role
     * @param name
     */
    getVolunteersToFestival: async (festivalId: number, page: number, pageSize: number, role?: Role,name? : string) => {
        const skip = (page - 1) * pageSize;
        let whereClause: { idFestival: number; role?: Role ;name?: String} = { idFestival: festivalId };

        if (role) {
            whereClause.role = role;
        }
        if(name){
            whereClause.name = name;
        }

        try {
            const volunteersToFestival = await prisma.isVolunteer.findMany({
                where: whereClause,
                skip: skip,
                take: pageSize,
            });
            logger.info(`Récupération des volontaires au festival avec succès`);
            return volunteersToFestival;
        } catch (error) {
            logger.error(`Erreur lors de la récupération des volontaires au festival: ${error}`);
        }
    },
    /**
     *permets de modifier les informations d'un volontaire à un festival
     * @param volunteer
     */
    updateVolunteerToFestival: async (volunteer: VolunteerInterface) => {
        try {
            const { volunteerId, festivalId, isVege, sizeTeeShirt, role } = volunteer;

            let updateData: { isVege?: boolean; sizeTeeShirt?: string; role?: Role } = {};
            if (isVege !== undefined) updateData.isVege = isVege;
            if (sizeTeeShirt !== undefined) updateData.sizeTeeShirt = sizeTeeShirt;
            if (role !== undefined) updateData.role = role;

            const volunteerToFestival = await prisma.isVolunteer.updateMany({
                where: {
                    idUser: volunteerId,
                    idFestival: festivalId
                },
                data: updateData
            });

            logger.info(`Modification du volontaire au festival avec succès`);
            return volunteerToFestival;
        } catch (error) {
            logger.error(`Erreur lors de la modification du volontaire au festival: ${error}`);
        }
    },
    getFestivalsByVolunteer: async (volunteerId: string, page: number, pageSize: number, role?: Role, startDate?: Date, endDate?: Date) => {
        const skip = (page - 1) * pageSize;
        let whereClause: { idUser: string; role?: Role; festival?: { dateDebut?: any; dateFin?: any; } } = { idUser: volunteerId };
    
        if (role) {
            whereClause.role = role;
        }
    
        // Créer un filtre de date pour le festival
        whereClause.festival = {};
        if (startDate) {
            whereClause.festival.dateDebut = { gte: startDate };
        }
        if (endDate) {
            whereClause.festival.dateFin = { lte: endDate };
        }
    
        try {
            const festivals = await prisma.isVolunteer.findMany({
                where: whereClause,
                skip: skip,
                take: pageSize,
                include: {
                    festival: true
                }
            });
            logger.info(`Récupération des festivals par volontaire avec succès`);
            return festivals;
        } catch (error) {
            logger.error(`Erreur lors de la récupération des festivals par volontaire: ${error}`);
        }
    }
    
        
}

export default volunteerToFestivalService;