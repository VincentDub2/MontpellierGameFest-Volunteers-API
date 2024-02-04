import prisma from '../prisma';

const createCleanDonnee = () => {
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

    const user = {
            email: 'test',
            firstName: 'test',
            lastName: 'test',
            address: 'test',
            phoneNumber: 'test',
            emailVerified: true,
    }



}