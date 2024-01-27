import express from "express";
import isPlayController from "../controllers/isPlay.controller";


export default (router: express.Router) => {
    // Route pour ajouter un jeu joué à un festival
    router.post('/isPlay', isPlayController.addPlay);

// Route pour obtenir un jeu joué par ses identifiants
    router.get('/isPlay/:idGame/:idFestival', isPlayController.getPlayById);

// Route pour supprimer un jeu joué
    router.delete('/isPlay/:idGame/:idFestival', isPlayController.deletePlay);
};