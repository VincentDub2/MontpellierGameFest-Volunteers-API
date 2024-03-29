import express from 'express';
import creneauController from '../controllers/creneau.controller';

export default (router: express.Router) => {
    router.post('/creneaux', creneauController.addCreneau);
    //route pour ajouter plusieurs créneaux
    router.post('/creneaux/multiple', creneauController.addMultipleCreneaux);
    // Route pour obtenir un créneau par son ID
    router.get('/creneaux/:idCreneau', creneauController.getCreneauById);
    // Route pour mettre à jour un créneau
    router.put('/creneaux/:idCreneau', creneauController.updateCreneau);
    // Route pour supprimer un créneau
    router.delete('/creneaux/:idCreneau', creneauController.deleteCreneau);
    // Avoir les creneaux d'un user d'un festival
    router.get('/creneaux/user/:idUser/festival/:idFestival', creneauController.getCreneauxByUser);

    return router;
};