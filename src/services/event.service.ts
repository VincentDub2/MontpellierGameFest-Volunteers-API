import prisma from "../prisma";
import { Event } from '@prisma/client';

const eventService = {
    // Ajouter un nouvel événement
    addEvent: async (
        name: string,
        dateEvent: Date,
        duration : number,
        address: string,
        city: string,
        postalCode: string,
        country: string,
        idManager: string,
        description: string
    ): Promise<Event | null> => {
        try {
            return await prisma.event.create({
                data: {
                    dateEvent,
                    name,
                    address,
                    city,
                    postalCode,
                    country,
                    duration,
                    description,
                    manager: {
                        connect: { id: idManager }
                    }
                },
            });
        } catch (error) {
            throw new Error(`Error adding event: ${error}`);
        }
    },

    // Obtenir un événement par son ID
    getEventById: async (idEvent: number): Promise<Event | null> => {
        try {
            return await prisma.event.findUnique({
                where: { idEvent },
                include: {
                    manager: true, // Inclut les détails du manager
                    isPresented: true // Inclut les présentations liées à l'événement
                }
            });
        } catch (error) {
           throw new Error(`Error retrieving event: ${error}`);
        }
    },

    // Obtenir tous les événements
    getAllEvents: async (): Promise<Event[] | null> => {
        try {
            return await prisma.event.findMany({
                include: {
                    manager: true, // Inclut les détails du manager
                    isPresented: true // Inclut les présentations liées à chaque événement
                }
            });
        } catch (error) {
            throw new Error(`Error retrieving events: ${error}`);
        }
    },

    // Mettre à jour un événement
    updateEvent: async (idEvent: number,
                        name?: string,
                        dateEvent?: Date,
                        duration? : number,
                        address?: string,
                        city?: string,
                        postalCode?: string,
                        country?: string,
                        idManager?: string,
                        description?: string
    ): Promise<Event | null> => {
        let userId : string | null = null
        try {
            if (idManager !== undefined && idManager !== null && idManager !== '') {
                const userExists = await prisma.user.findUnique({ where: { id: idManager } });
                if (!userExists) {
                    throw new Error(`Manager with the provided ID does not exist ${idManager}.`);
                }
                userId = idManager;

            }

            return await prisma.event.update({
                where: { idEvent },
                data: {
                    dateEvent,
                    address,
                    city,
                    postalCode,
                    country,
                    duration,
                    name,
                    description,
                    ... (userId && { manager: { connect: { id: userId } } })
                },
            });
        } catch (error) {
            throw new Error(`Error updating event: ${error}`);
        }
    },

    // Supprimer un événement
    deleteEvent: async (idEvent: number): Promise<Event | null> => {
        try {
            return await prisma.event.delete({
                where: { idEvent },
            });
        } catch (error) {
            throw new Error(`Error deleting event: ${error}`);
        }
    },
};

export default eventService;