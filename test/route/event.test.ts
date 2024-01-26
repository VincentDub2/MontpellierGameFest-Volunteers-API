import request from 'supertest';
import { app, server } from '../../src'; // Assurez-vous que le chemin est correct
import prisma from '../../src/prisma';
import {User} from "@prisma/client"; // Importez l'instance Prisma

beforeAll(async () => {
    // Initialisation de la base de données de test pour les événements
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.user.create({
        data: {
            email: 'test',
            firstName: 'test',
            lastName: 'test',
            address: 'test',
            phoneNumber: 'test',
            emailVerified: true,
        }
    })
});

afterAll(async () => {
    // Nettoyage de la base de données après les tests
    await prisma.event.deleteMany({});
    await prisma.$disconnect();
    server.close();
});

describe('Event API Endpoints', () => {
    let eventId : number;
    let user : User | null;
    it('should create a new event', async () => {
        user = await prisma.user.findFirst();
        if (!user) throw new Error('User not found');
        const newEvent = {
            dateEvent : new Date(),
            addressEvent:'',
            idManager:user.id
        };

        const res = await request(app).post('/events').send(newEvent);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('idEvent');
        eventId = res.body.idEvent; // Sauvegardez l'ID pour l'utiliser dans d'autres tests
    });

    it('should get a single event by ID', async () => {
        const res = await request(app).get(`/events/${eventId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idEvent', eventId);
    });

    it('should get all events', async () => {
        const res = await request(app).get('/events');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should update an event', async () => {
        const updatedEvent = { /* vos nouvelles données d'événement */ };
        const res = await request(app).put(`/events/${eventId}`).send(updatedEvent);
        expect(res.statusCode).toEqual(200);
    });

    it('should delete an event', async () => {
        const res = await request(app).delete(`/events/${eventId}`);
        expect(res.statusCode).toEqual(200);
    });
});
