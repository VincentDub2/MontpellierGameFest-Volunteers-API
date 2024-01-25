import express from "express";
import getAllGames from "../controllers/gameController";
import gameController from "../controllers/gameController";

export default (router: express.Router) => {
    router.get('/games',gameController.getAllGames);
    router.get('/games/:id',gameController.getGameById);
    router.delete('/games/:id',gameController.deleteGameById);
    router.post('/games',gameController.createGame);
    router.put('/games/:id',gameController.updateGame);
};