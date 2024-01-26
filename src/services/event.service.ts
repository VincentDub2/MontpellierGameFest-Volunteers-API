import prisma from "../prisma";
import { Event } from '@prisma/client';

const eventService = {
    // Ajouter un nouvel événement
    addEvent: async (dateEvent: Date, addressEvent: string, idManager: string): Promise<Event | null> => {
        try {
            return await prisma.event.create({
                data: {
                    dateEvent,
                    addressEvent,
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
    updateEvent: async (idEvent: number, dateEvent?: Date, addressEvent?: string): Promise<Event | null> => {
        try {
            return await prisma.event.update({
                where: { idEvent },
                data: {
                    dateEvent,
                    addressEvent
                    // Ajoutez d'autres champs si nécessaire
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
