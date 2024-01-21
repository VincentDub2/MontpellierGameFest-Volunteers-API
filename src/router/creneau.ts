import express from 'express';
import creneauController from '../controllers/creneauController';
import upload from "../middlewares/uploadMiddleware";

export default (router: express.Router) => {
    router.post('/creneaux', creneauController.addCreneau);
    // Route pour obtenir un créneau par son ID
    router.get('/creneaux/:idCreneau', creneauController.getCreneauById);
    // Route pour mettre à jour un créneau
    router.put('/creneaux/:idCreneau', creneauController.updateCreneau);
    // Route pour supprimer un créneau
    router.delete('/creneaux/:idCreneau', creneauController.deleteCreneau);
    return router;
};