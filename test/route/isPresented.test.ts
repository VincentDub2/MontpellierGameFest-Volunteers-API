import request from 'supertest';
import { app, server } from '../../src'; // Assurez-vous que le chemin est correct
import prisma from '../../src/prisma'; // Importez l'instance Prisma

jest.setTimeout(30000);

beforeAll(async () => {
    // Initialisation de la base de données de test pour isPresented
    await prisma.isPresented.deleteMany({});
    await prisma.jeux.deleteMany({});

    const newGame = { idGame: 1, name: 'New Game', type: 'Adventure' };
    const game = await prisma.jeux.create(
        {data: newGame}
    )
    /*
    dateEvent    DateTime
  addressEvent String
  idManager    String
  manager      User
     */
    let user = await prisma.user.findFirst();
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'test',
                firstName: 'test',
                lastName: 'test',
                address: 'test',
                phoneNumber: 'test',
                emailVerified: true,
            }
        })
    }
    const newEvent = { idEvent: 1, name: 'New Event', dateEvent: new Date('2022-01-01T10:00:00'),duration : 3, address: '1 rue du festival', city: 'Paris', postalCode: '75000', country: 'France',idManager: user.id};
    const event = await prisma.event.create(
        {data: newEvent}
    )

});

afterAll(async () => {
    // Nettoyage de la base de données après les tests
    await prisma.isPresented.deleteMany({});
    await prisma.$disconnect();
    server.close();
});

describe('IsPresented API Endpoints', () => {
    // Test pour POST /isPresented
    let idGame: number;
    let idEvent: number;
    let idGame2: number;
    it('should add a new presentation', async () => {
        idGame = await prisma.jeux.findFirst().then((game) => {
            if (!game) throw new Error('Game not found');
            return game.idGame;
        })
        idEvent = await prisma.event.findFirst().then((event) => {
            if (!event) throw new Error('Event not found');
            return event.idEvent;
        })
        const newPresentationData = { idGame, idEvent };
        const res = await request(app).post('/isPresented').send(newPresentationData);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('idGame', newPresentationData.idGame);
        // ... autres assertions ...
    });

    // Test pour GET /isPresented/:idGame/:idEvent
    it('should get a presentation by idGame and idEvent', async () => {
        const res = await request(app).get(`/isPresented/${idGame}/${idEvent}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idGame', idGame);
        // ... autres assertions ...
    });

    // Test pour PUT /isPresented/:idGame/:idEvent
    it('should update a presentation', async () => {
        const jeu2 = await prisma.jeux.create(
            {data: {idGame: 2, name: 'New Game', type: 'Adventure'}}
        )
        idGame2 = jeu2.idGame;
        const updatedData = { newIdGame: jeu2.idGame, idEvent};
        const res = await request(app).put(`/isPresented/${idGame}/${idEvent}`).send(updatedData);
        expect(res.statusCode).toEqual(200);

    });

    // Test pour DELETE /isPresented/:idGame/:idEvent
    it('should delete a presentation', async () => {
        const res = await request(app).delete(`/isPresented/${idGame2}/${idEvent}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Presentation deleted');
    });
});
