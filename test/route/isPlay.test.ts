import request from 'supertest';
import { app, server } from '../../src'; // Assurez-vous que le chemin est correct
import prisma from '../../src/prisma'; // Importez l'instance Prisma

jest.setTimeout(30000);

beforeAll(async () => {
    // Initialisation de la base de données de test pour isPlay
    await prisma.isPlay.deleteMany({});
    await prisma.festival.deleteMany({})
    await prisma.jeux.deleteMany({});
    //vider la table festival
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
    const festival = await prisma.festival.create(
        {data: newFestival}
    )

    const newGame = { idGame: 1, name: 'New Game', type: 'Adventure' };
    const game = await prisma.jeux.create(
        {data: newGame}
    )
});

afterAll(async () => {
    // Nettoyage de la base de données après les tests
    await prisma.isPlay.deleteMany({});
    await prisma.$disconnect();
    server.close();
});

describe('IsPlay API Endpoints', () => {
    let festivalId: number;
    let gameId: number;
    // Test pour POST /isPlay
    it('should add a new play', async () => {
       festivalId = await prisma.festival.findFirst().then(festival => {
            if (!festival) throw new Error('Festival not found');
            return festival.idFestival;
        });
        gameId = await prisma.jeux.findFirst().then(game => {
            if (!game) throw new Error('Game not found');
            return game.idGame;
        });

        const newPlayData = { idGame: gameId, idFestival: festivalId };

        const res = await request(app).post('/isPlay').send(newPlayData);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('idGame', newPlayData.idGame);
        // ... autres assertions ...
    });

    // Test pour GET /isPlay/:idGame/:idFestival
    it('should get a play by idGame and idFestival', async () => {
        const res = await request(app).get(`/isPlay/${gameId}/${festivalId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idGame', gameId);
        // ... autres assertions ...
    });

    // Test pour DELETE /isPlay/:idGame/:idFestival
    it('should delete a play', async () => {
        const res = await request(app).delete(`/isPlay/${gameId}/${festivalId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Play deleted');
        // ... autres assertions ...
    });
});
