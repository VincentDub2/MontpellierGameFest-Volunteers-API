import express from 'express';
import posteController from '../controllers/posteController';

export default (router: express.Router) => {

    // Route pour ajouter un nouveau poste
    router.post('/postes', posteController.addPoste);

    // Route pour ajouter plusieurs postes
    router.post('/postes/multiple', posteController.addMultiplePostes);

    // Route pour obtenir un poste par son ID
    router.get('/postes/:idPoste', posteController.getPosteById);

    // Route pour mettre à jour un poste
    router.put('/postes/:idPoste', posteController.updatePoste);

    // Route pour supprimer un poste
    router.delete('/postes/:idPoste', posteController.deletePoste);

}
