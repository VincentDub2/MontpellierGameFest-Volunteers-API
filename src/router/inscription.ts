import express from 'express';
import inscriptionController from "../controllers/inscription.controller";

export default (router: express.Router) => {
    // Route pour ajouter une nouvelle inscription
    router.post('/inscriptions', inscriptionController.addInscription);

    // Route pour obtenir une inscription par ID
    router.get('/inscriptions/:idUser/creneauEspace/:idCreneauEspace', inscriptionController.getInscriptionById);

    // Route pour mettre à jour une inscription
    router.put('/inscriptions/:idUser/creneauEspace/:idCreneauEspace', inscriptionController.updateInscription);

    // Route pour supprimer une inscription
    router.delete('/inscriptions/:idUser/creneauEspace/:idCreneauEspace', inscriptionController.deleteInscription);

    //Obtenir toutes les inscriptions d'un utilisateur a un festival
    router.get('/inscriptions/:idUser/festival/:idFestival', inscriptionController.getInscriptionsByUserAndFestival);

    //Obtenir toutes les inscriptions
    router.get('/inscriptions', inscriptionController.getAllInscriptions);

}
