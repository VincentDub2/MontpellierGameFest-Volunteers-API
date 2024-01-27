import express from "express";
import isReferentController from "../controllers/referent.controller";

export default (router: express.Router) => {
    // Route pour ajouter un nouveau référent
    router.post('/referents', isReferentController.addReferent);

    // Route pour obtenir un référent par ses identifiants
    router.get('/referents/:idUser/:idEspace', isReferentController.getReferentById);

    // Route pour mettre à jour un référent
    router.put('/referents/:idUser/:idEspace', isReferentController.updateReferent);

    // Route pour supprimer un référent
    router.delete('/referents/:idUser/:idEspace', isReferentController.deleteReferent);

};