import express from "express";
import posteEspaceController from "../controllers/PosteEspace.controller";

export default (router: express.Router) => {
    // Route pour ajouter une nouvelle relation PosteEspace
    router.post('/posteEspaces', posteEspaceController.addPosteEspace);

// Route pour obtenir une relation PosteEspace par les IDs de Poste et Espace
    router.get('/posteEspaces/:idPoste/:idEspace', posteEspaceController.getPosteEspaceById);

// Route pour supprimer une relation PosteEspace
    router.delete('/posteEspaces/:idPoste/:idEspace', posteEspaceController.deletePosteEspace);

};