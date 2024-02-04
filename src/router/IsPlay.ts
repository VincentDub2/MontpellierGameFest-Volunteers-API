import express from "express";
import isPlayController from "../controllers/isPlay.controller";


export default (router: express.Router) => {
    // Route pour ajouter un jeu joué à un festival
    router.post('/isPlay', isPlayController.addPlay);

    // Route pour ajouter plusieurs jeux joués à un festival
    router.post('/isPlay/multiple', isPlayController.addMultiplePlays);

    // Route pour obtenir tous les jeux joués d'un espace à un festival
    router.get('/isPlay/:idEspace/:idFestival', isPlayController.getPlayById);

    // Route pour supprimer un jeu joué
    router.delete('/isPlay/:idGame/:idFestival/:idEspace', isPlayController.deletePlay);
};