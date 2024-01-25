import request from 'supertest';
import {app,server} from '../../src'; // Assurez-vous que le chemin est correct
import prisma from '../../src/prisma'; // Importez l'instance Prisma

beforeAll(async () => {
    // Initialisation de la base de données de test, si nécessaire
    await prisma.festival.deleteMany({});
    // ... Ajouter des données initiales pour les tests ...
});

afterAll(async () => {
    // Nettoyage de la base de données après les tests
    await prisma.festival.deleteMany({});
    await prisma.$disconnect();
    server.close()
});
describe('Festival API Endpoints', () => {
    // Test pour POST /festivals
    it('should create a new festival', async () => {
        const newFestival = {
            name: 'Festival Test',
            dateDebut: new Date('2022-01-01T10:00:00'),
            dateFin: new Date('2022-01-02T10:00:00'),
            address: '1 rue du festival',
            city: 'Paris',
            postalCode: '75000',
            country: 'France',
            isActive: true
        };
        const res = await request(app).post('/festivals').send(newFestival);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idFestival');
        // ... autres assertions ...
    });

    // Test pour GET /festivals
    it('should return all festivals', async () => {
        const res = await request(app).get('/festivals');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        // ... autres assertions ...
    });

    // Test pour GET /festivals/:id
    it('should return a single festival', async () => {
        const newFestival = {
            name: 'Festival Test',
            dateDebut: new Date('2023-01-01T10:00:00'),
            dateFin: new Date('2023-01-02T10:00:00'),
            address: '1 rue du festival',
            city: 'Paris',
            postalCode: '75000',
            country: 'France',
            isActive: true
        };
        const fest = await prisma.festival.create({data: newFestival})
        const res = await request(app).get(`/festivals/${fest.idFestival}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idFestival', fest.idFestival);
        // ... autres assertions ...
    });

    // Test pour DELETE /festivals/:id
    it('should delete a festival', async () => {
        const id = 1; // Utilisez un ID de festival valide
        const res = await request(app).delete(`/festivals/${id}`);
        expect(res.statusCode).toEqual(200);
        // ... autres assertions ...
    });
    // Récupération du dernier festival
    it('should return the last festival', async () => {
        const res = await request(app).get('/festivals/last');
        expect(res.statusCode).toEqual(200);
        // ... autres assertions ...
    });

    // Récupération du festival actif
    it('should return the active festival', async () => {
        const res = await request(app).get('/festivals/current');
        expect(res.statusCode).toEqual(200);
        // ... autres assertions ...
    });

    // Récupération du prochain festival
    it('should return the next festival', async () => {
        const res = await request(app).get('/festivals/next');
        expect(res.statusCode).toEqual(200);
        // ... autres assertions ...
    });
})

describe('Volunteer to Festival API Endpoints', () => {
    // Ajout d'un volontaire à un festival
    it('should add a volunteer to a festival', async () => {
        // ... Test pour ajouter un volontaire à un festival ...
    });

    // Suppression d'un volontaire d'un festival
    it('should delete a volunteer from a festival', async () => {
        // ... Test pour supprimer un volontaire d'un festival ...
    });

    // Récupération d'un volontaire spécifique d'un festival
    it('should get a specific volunteer of a festival', async () => {
        // ... Test pour récupérer un volontaire spécifique d'un festival ...
    });

    // Récupération de tous les volontaires d'un festival
    it('should get all volunteers of a festival', async () => {
        // ... Test pour récupérer tous les volontaires d'un festival ...
    });

    // Mise à jour d'un volontaire d'un festival
    it('should update a volunteer of a festival', async () => {
        // ... Test pour mettre à jour un volontaire d'un festival ...
    });
});

describe('Poste API Endpoints', () => {
    // Récupération de tous les postes d'un festival
    it('should get all postes of a specific festival', async () => {
        // ... Test pour récupérer tous les postes d'un festival spécifique ...
    });
});

describe('Creneau API Endpoints', () => {
    // Récupération de tous les créneaux d'un festival
    it('should get all creneaux of a specific festival', async () => {
        // ... Test pour récupérer tous les créneaux d'un festival ...
    });
});