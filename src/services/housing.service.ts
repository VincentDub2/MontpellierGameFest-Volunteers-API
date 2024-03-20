import prisma from "../prisma";

const housingService = {
    /**
     * Ajouter un logement a proposé
     * @param availibility
     * @param description
     * @param city
     * @param postalCode
     * @param idUser
     */
    addHousing: async (availibility : string,description : string,city: string,postalCode:string, idUser: string) => {
        try {
            return await prisma.housing.create({
                data: {
                    availibility,
                    description,
                    city,
                    idUser,
                    postalCode,
                    country: "France",
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout du logement: ${error}`);
        }
    },
    /**
     * Récupérer tous les logements
     */
    getAllHousing: async () => {
        try {
            return await prisma.housing.findMany();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des logements: ${error}`);
        }
    },
    /**
     * Récupérer un logement par son id
     * @param idHousing
     */
    getHousingById: async (idHousing: number) => {
        try {
            return await prisma.housing.findUnique({
                where: {
                    idHousing
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du logement: ${error}`);
        }
    },
    /**
     * Supprimer un logement par son id
     * @param idHousing
     */
    deleteHousingById: async (idHousing: number) => {
        try {
            return await prisma.housing.delete({
                where: {
                    idHousing
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du logement: ${error}`);
        }
    }
}

export default housingService;