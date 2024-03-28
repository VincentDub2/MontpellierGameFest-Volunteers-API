import prisma from "../prisma";
import { logger } from "../helpers/loggers.vercel";
import inscription from "../router/inscription";

const planingService = {
    getPlaningForUser: async (idUser: string, idFestival: number) => {
        try {
            const planing = await prisma.user.findUnique({
                where: {
                    id: idUser,
                },
                include: {
                    inscriptions: {
                        include: {
                            creneauEspace: {
                                include: {
                                    espace: {
                                        include: {
                                           isPlay: {
                                               include: {
                                                   game: true,
                                               }
                                           },
                                            posteEspaces: {
                                                include: {
                                                    poste: true,
                                                }
                                                },
                                            }
                                    },
                                    creneau: true,
                                },
                            },
                            Jeux: true,
                        },
                    },isReferent: true,
                },
            });
            const isReferent = planing?.isReferent.map(referent => referent.idEspace);

            // Transformation des données
            const filteredPlaning = {

                inscriptions: planing?.inscriptions.map(inscription => ({
                    idCreneau: inscription.creneauEspace.idCreneau,
                    timeStart: inscription.creneauEspace.creneau.timeStart,
                    timeEnd: inscription.creneauEspace.creneau.timeEnd,
                    idFestival: inscription.creneauEspace.creneau.idFestival,
                    Jeux: inscription.Jeux?.name || null,
                    name: inscription.creneauEspace.espace.name,
                    postId:inscription.creneauEspace.espace.posteEspaces.map(posteEspace => posteEspace.poste.idPoste).join(", "),
                    description: inscription.creneauEspace.espace.posteEspaces.map(posteEspace => posteEspace.poste.description).join(", "),
                    isReferent: isReferent?.includes(inscription.creneauEspace.idEspace)
                })),
            };

            return filteredPlaning;
        } catch (error) {
            logger.error('Failed to get planning for user', { idUser, idFestival, error });
            throw error;
        }
    },
};


export default planingService;