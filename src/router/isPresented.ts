// Route pour ajouter une nouvelle présentation
import isPresentedController from "../controllers/isPresented.controller";
import express from "express";
export default (router: express.Router) => {
    router.post('/isPresented', isPresentedController.addPresentation);

    // Route pour obtenir une présentation par ses identifiants
    router.get('/isPresented/:idGame/:idEvent', isPresentedController.getPresentationById);

    // Route pour mettre à jour une présentation
    router.put('/isPresented/:idGame/:idEvent', isPresentedController.updatePresentation);

    // Route pour supprimer une présentation
    router.delete('/isPresented/:idGame/:idEvent', isPresentedController.deletePresentation);
}