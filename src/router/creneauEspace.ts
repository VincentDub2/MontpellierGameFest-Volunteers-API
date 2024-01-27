import express from 'express';
import creneauEspaceController from "../controllers/creneauEspace.service";

export default (router: express.Router) => {
    // Route pour ajouter un nouveau CreneauEspace
    router.post('/creneauEspaces', creneauEspaceController.addCreneauEspace);

    // Route pour obtenir un CreneauEspace par son ID
    router.get('/creneauEspaces/:idCreneauEspace', creneauEspaceController.getCreneauEspaceById);

    // Route pour obtenir tous les CreneauEspaces
    router.get('/creneauEspaces', creneauEspaceController.getAllCreneauEspaces);

    // Route pour mettre à jour un CreneauEspace
    router.put('/creneauEspaces/:idCreneauEspace', creneauEspaceController.updateCreneauEspace);

    // Route pour supprimer un CreneauEspace
    router.delete('/creneauEspaces/:idCreneauEspace', creneauEspaceController.deleteCreneauEspace);
    return router;
};