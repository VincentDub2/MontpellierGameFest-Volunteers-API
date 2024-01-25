import request from 'supertest';
import app from '../../src/index'; // Assurez-vous que le chemin est correct
import prisma from '../../src/prisma'; // Importez l'instance Prisma

beforeAll(async () => {
    // Initialisation de la base de données de test, si nécessaire
    await prisma.jeux.deleteMany({});
    // ... Ajouter des données initiales pour les tests ...
});

afterAll(async () => {
    // Nettoyage de la base de données après les tests
    await prisma.jeux.deleteMany({});
    await prisma.$disconnect();
});

describe('Game API Endpoints', () => {
    // Test pour GET /games
    it('should return a list of games', async () => {
        const res = await request(app).get('/games');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    // Test pour POST /games
    it('should create a new game', async () => {
        const newGame = { idGame:3,name: 'New Game', type: 'Adventure' };
        const res = await request(app).post('/games').send(newGame);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idGame');
    });

    // Test pour GET /games/:id
    it('should return a single game', async () => {
        const game = await prisma.jeux.create({
            data: {
                idGame: 1,
                name: 'Test Game',
                type: 'Puzzle'
            },
        });
        const res = await request(app).get(`/games/${game.idGame}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', game.idGame);
    });

    // Test pour PUT /games/:id
    it('should update a game', async () => {
        const game = await prisma.jeux.create({
            data: {
                idGame: 1,
                name: 'Old Game',
                type: 'Action' },
        });
        const updatedData = { name: 'Updated Game', genre: 'Adventure' };
        const res = await request(app).put(`/games/${game.idGame}`).send(updatedData);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Updated Game');
    });

    // Test pour DELETE /games/:id
    it('should delete a game', async () => {
        const game = await prisma.jeux.create({
            data: {
                idGame:2,
                name: 'Game to Delete',type: 'Strategy' },
        });
        const res = await request(app).delete(`/games/${game.idGame}`);
        expect(res.statusCode).toEqual(200);
    });
});
 // Fermez le serveur après les tests
afterAll(() => {
} );