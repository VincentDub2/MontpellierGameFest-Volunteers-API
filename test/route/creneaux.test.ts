import request from 'supertest';
import {app,server} from '../../src'; // Assurez-vous que le chemin est correct
import prisma from '../../src/prisma'; // Importez l'instance Prisma

beforeAll(async () => {
    // Initialisation de la base de données de test, si nécessaire
    await prisma.creneau.deleteMany({});
    await prisma.festival.deleteMany({})
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
    console.log(festival)
});

afterAll(async () => {
    // Nettoyage de la base de données après les tests
    await prisma.creneau.deleteMany({});
    await prisma.$disconnect();
    server.close()
});

describe('Creneau API Endpoints', () => {
    // Test pour POST /creneaux
    it('should create a new creneau', async () => {
        const newCreneau = { timeStart: new Date('2022-01-01T10:00:00'), timeEnd: new Date('2022-01-01T12:00:00'), idFestival: 1 };
        const res = await request(app).post('/creneaux').send(newCreneau);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('idCreneau');
    });

    // Test pour POST /creneaux/multiple
    it('should create multiple creneaux', async () => {
        const creneauxData = [
            { timeStart: new Date('2022-01-02T10:00:00'), timeEnd: new Date('2022-01-02T12:00:00'), idFestival: 1 },
            { timeStart: new Date('2022-01-02T14:00:00'), timeEnd: new Date('2022-01-02T16:00:00'), idFestival: 1}
        ];
        const res = await request(app).post('/creneaux/multiple').send({ creneauxData });
        expect(res.statusCode).toEqual(201);

        const creneaux = await prisma.creneau.findMany();
        expect(creneaux.length).toEqual(3);
    });

    // Test pour GET /creneaux/:idCreneau
    it('should return a single creneau', async () => {
        const creneau = await prisma.creneau.create({ // Assurez-vous d'avoir la table 'creneau'
            data: { timeStart: new Date('2022-01-03T10:00:00'), timeEnd: new Date('2022-01-03T12:00:00'), idFestival: 1 }
        });
        const res = await request(app).get(`/creneaux/${creneau.idCreneau}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idCreneau', creneau.idCreneau);
    });

    // Test pour PUT /creneaux/:idCreneau
    it('should update a creneau', async () => {
        const creneau = await prisma.creneau.create({ // Assurez-vous d'avoir la table 'creneau'
            data: { timeStart: new Date('2022-01-04T10:00:00'), timeEnd: new Date('2022-01-04T12:00:00').toISOString(), idFestival: 1 }
        });
        const updatedCreneau = { timeStart: new Date('2022-01-04T11:00:00'), timeEnd: new Date('2022-01-04T13:00:00')};
        const res = await request(app).put(`/creneaux/${creneau.idCreneau}`).send(updatedCreneau);
        expect(res.statusCode).toEqual(200);

    });

    // Test pour DELETE /creneaux/:idCreneau
    it('should delete a creneau', async () => {
        const creneau = await prisma.creneau.create({ // Assurez-vous d'avoir la table 'creneau'
            data: { timeStart: new Date('2022-01-05T10:00:00'), timeEnd: new Date('2022-01-05T12:00:00'), idFestival: 1 }
        });
        const res = await request(app).delete(`/creneaux/${creneau.idCreneau}`);
        expect(res.statusCode).toEqual(200);
    });
});
