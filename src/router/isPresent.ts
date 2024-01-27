import express from "express";
import isPresentController from "../controllers/isPresent.controller";


export default (router: express.Router) => {
    // Route pour ajouter une nouvelle présence
    router.post('/isPresent', isPresentController.addPresence);

    // Route pour obtenir une présence par ses identifiants
    router.get('/isPresent/:idFestival/:idUser/:date', isPresentController.getPresenceById);

    // Route pour mettre à jour une présence
    router.put('/isPresent/:idFestival/:idUser/:date', isPresentController.updatePresence);

    // Route pour supprimer une présence
    router.delete('/isPresent/:idFestival/:idUser/:date', isPresentController.deletePresence);

};