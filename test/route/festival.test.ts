import request from 'supertest';
import {app,server} from '../../src'; // Assurez-vous que le chemin est correct
import prisma from '../../src/prisma';
import {IsVolunteer} from "@prisma/client"; // Importez l'instance Prisma
//Augmentation du temps d'attente
jest.setTimeout(30000);
beforeAll(async () => {
    // Initialisation de la base de données de test, si nécessaire
    await prisma.festival.deleteMany({});
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
    await prisma.festival.create({
            data: {
                name: 'Festival Test',
                dateDebut: new Date('2021-01-01T10:00:00'),
                dateFin: new Date('2021-01-02T10:00:00'),
                address: '1 rue du festival',
                city: 'Paris',
                postalCode: '75000',
                country: 'France',
                isActive: true
            }
        }
    );
});


afterAll(async () => {
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
        const fest = await prisma.festival.findFirst()
        if (!fest) throw new Error('Festival not found');
        const res = await request(app).get(`/festivals/${fest.idFestival}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idFestival', fest.idFestival);
        // ... autres assertions ...
    });

    // Test pour DELETE /festivals/:id
    it('should delete a festival', async () => {
        const fest = await prisma.festival.findFirst()
        if (!fest) throw new Error('Festival not found');
        const res = await request(app).delete(`/festivals/${fest.idFestival}`);
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
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    // Récupération du prochain festival
    it('should return the next festival', async () => {
        const newFestival = {
            name: 'Festival Test',
            dateDebut: new Date('2025-01-01T10:00:00'),
            dateFin: new Date('2025-01-02T10:00:00'),
            address: '1 rue du festival',
            city: 'Paris',
            postalCode: '75000',
            country: 'France',
            isActive: true
        };
        const fest = await prisma.festival.create({data: newFestival})
        const res = await request(app).get('/festivals/next');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idFestival', fest.idFestival);
    });
})

describe('Volunteer to Festival API Endpoints', () => {
    // Ajout d'un volontaire à un festival
    it('should add a volunteer to a festival', async () => {
        const fest = await prisma.festival.findFirst()
        if (!fest) throw new Error('Festival not found');
        const user = await prisma.user.findFirst()
        if (!user) throw new Error('User not found');
        const newVolunteer ={
            idFestival: fest.idFestival,
            idUser: user.id,
            isVege: false,
            sizeTeeShirt: 'M',
            role: 'referent',
        };
        const res = await request(app).post(`/festivals/${fest.idFestival}/volunteers`).send(newVolunteer);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idFestival', fest.idFestival);
        expect(res.body).toHaveProperty('idUser', user.id);
    });

    // Récupération d'un volontaire spécifique d'un festival
    it('should get a specific volunteer of a festival', async () => {
        const volunteer = await prisma.isVolunteer.findFirst();
        if (!volunteer) throw new Error('Volunteer not found');
        const res = await request(app).get(`/festivals/${volunteer.idFestival}/volunteers/${volunteer.idUser}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('idFestival', volunteer.idFestival);
        expect(res.body).toHaveProperty('idUser', volunteer.idUser);
    });
    // Récupération de tous les volontaires d'un festival
    it('should get all volunteers of a festival', async () => {
        const volunteer = await prisma.isVolunteer.findFirst();
        if (!volunteer) throw new Error('Volunteer not found');
        const res = await request(app).get(`/festivals/${volunteer.idFestival}/volunteers?page=1&pageSize=10`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body).toContainEqual(volunteer);
    });

    // Mise à jour d'un volontaire d'un festival
    it('should update a volunteer of a festival', async () => {
        const volunteer = await prisma.isVolunteer.findFirst();
        if (!volunteer) throw new Error('Volunteer not found');
        const res = await request(app).put(`/festivals/${volunteer.idFestival}/volunteers/${volunteer.idUser}`).send({isVege: true});
        expect(res.statusCode).toEqual(200);
        console.log(res.body)
        expect(res.body.count).toEqual(1);
        const verifVolunteer = await prisma.isVolunteer.findFirst({
            where: {
                idFestival: volunteer.idFestival,
                idUser: volunteer.idUser
            }
        });
        if (!verifVolunteer) throw new Error('Volunteer not found');
        expect(verifVolunteer).toHaveProperty('isVege', true);
    });

    // Suppression d'un volontaire d'un festival
    it('should delete a volunteer from a festival', async () => {
        const volunteer = await prisma.isVolunteer.findFirst();
        if (!volunteer) throw new Error('Volunteer not found');
        const res = await request(app).delete(`/festivals/${volunteer.idFestival}/volunteers/${volunteer.idUser}`);
        expect(res.statusCode).toEqual(200);

        const verifVolunteer = await prisma.isVolunteer.findFirst({
            where: {
                idFestival: volunteer.idFestival,
                idUser: volunteer.idUser
            }
        });
        expect(verifVolunteer).toBeNull();
    });

});

describe('Poste API Endpoints', () => {
    // Récupération de tous les postes d'un festival
    it('should get all postes of a specific festival', async () => {
        const fest = await prisma.festival.findFirst()
        if (!fest) throw new Error('Festival not found');
        const poste = await prisma.poste.create({
            data: {
                idFestival: fest.idFestival,
                name: 'Poste Test',
                capacityPoste: 1,
            }
        });
        if (!poste) throw new Error('Poste not found');

        const res = await request(app).get(`/festivals/${fest.idFestival}/postes`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body).toContainEqual(poste);
    });
});

describe('Creneau API Endpoints', () => {
    // Récupération de tous les créneaux d'un festival
    it('should get all creneaux of a specific festival', async () => {
        const fest = await prisma.festival.findFirst()
        if (!fest) throw new Error('Festival not found');
        const poste = await prisma.poste.create({
            data: {
                idFestival: fest.idFestival,
                name: 'Poste Test',
                capacityPoste: 1,
            }
        });
        if (!poste) throw new Error('Poste not found');
        const espace = await prisma.espace.create({
            data: {
                name: 'Espace Test',
            }
        });
        if (!espace) throw new Error('Espace not found');
        const creneau = await prisma.creneau.create({
            data: {
                idFestival: fest.idFestival,
                timeStart: new Date('2025-01-01T10:00:00'),
                timeEnd: new Date('2025-01-01T12:00:00'),
                creneauEspace: {
                    create: {
                        idEspace: espace.idEspace,
                    }
                }
            }
        });
        if (!creneau) throw new Error('Creneau not found');

        const allCreneau = await prisma.creneau.findMany({
            where: {
                idFestival: fest.idFestival,
            }
        });
        if (!allCreneau) throw new Error('Creneau not found');

        const res = await request(app).get(`/festivals/${fest.idFestival}/creneaux`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();

        const res2 = await request(app).get(`/festivals/${fest.idFestival}/creneaux?idEspace=${espace.idEspace}`)
        expect(res2.statusCode).toEqual(200)
        expect(Array.isArray(res2.body)).toBeTruthy()
        console.log(res2.body)

        const res3 = await request(app).get(`/festivals/${fest.idFestival}/creneaux?idEspace=${poste.idPoste}`)
        expect(res3.statusCode).toEqual(200)
        expect(Array.isArray(res3.body)).toBeTruthy()
        console.log(res3.body)
    });
});