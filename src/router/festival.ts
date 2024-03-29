import express from "express";
import festivalController from "../controllers/festival.controller";
import volunteerToFestivalController from "../controllers/volunteerToFestival.controller";
import posteController from '../controllers/poste.controller';
import creneauController from '../controllers/creneau.controller';

export default (router: express.Router) => {
    router.post('/festivals', festivalController.createAFestival);
    router.get('/festivals', festivalController.getAllFestivals);

    router.get('/festivals/last', festivalController.getLastFestival);

    router.get('/festivals/current', festivalController.getActiveFestival);

    router.get('/festivals/next', festivalController.getNextFestival);

    router.get('/festivals/:id', festivalController.getFestivalById);

    router.delete('/festivals/:id', festivalController.deleteFestivalById);

    router.put('/festivals/:id', festivalController.updateFestival);

    // Ajouter un volontaire à un festival
    router.post('/festivals/:festivalId/volunteers', volunteerToFestivalController.addVolunteerToFestival);

    // Supprimer un volontaire d'un festival
    router.delete('/festivals/:festivalId/volunteers/:volunteerId', volunteerToFestivalController.deleteVolunteerToFestival);

    // Récupérer un volontaire spécifique d'un festival
    router.get('/festivals/:festivalId/volunteers/:volunteerId', volunteerToFestivalController.getVolunteerToFestival);

    // Récupérer tous les volontaires d'un festival
    router.get('/festivals/:festivalId/volunteers', volunteerToFestivalController.getVolunteersToFestival);

    // Mettre à jour un volontaire d'un festival
    router.put('/festivals/:festivalId/volunteers/:volunteerId', volunteerToFestivalController.updateVolunteerToFestival);  

    // Route pour obtenir tous les postes d'un festival spécifique
    router.get('/festivals/:idFestival/postes', posteController.getAllPostesByFestival);

    // Route pour obtenir tous les créneaux d'un festival donné
    router.get('/festivals/:idFestival/creneaux', creneauController.getAllCreneauxByFestival);

    return router;
};
