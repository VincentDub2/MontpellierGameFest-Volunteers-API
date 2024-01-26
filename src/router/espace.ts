import express from "express";
import espaceController from "../controllers/espace.controller";

export default (router: express.Router) => {
    // Route pour ajouter un nouvel espace
    router.post('/espaces', espaceController.addEspace);

    // Route pour obtenir un espace par son ID
    router.get('/espaces/:idEspace', espaceController.getEspaceById);

    // Route pour obtenir tous les espaces
    router.get('/espaces', espaceController.getAllEspaces);

    // Route pour mettre à jour un espace
    router.put('/espaces/:idEspace', espaceController.updateEspace);

    // Route pour supprimer un espace
    router.delete('/espaces/:idEspace', espaceController.deleteEspace);
};