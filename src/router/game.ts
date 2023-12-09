import express from "express";
import getAllGames from "../controllers/gameController";
import gameController from "../controllers/gameController";

export default (router: express.Router) => {
    router.get('/games',gameController.getAllGames);
    router.get('/game/:id',gameController.getGameById);
    router.delete('/game/:id',gameController.deleteGameById);
    router.post('/game',gameController.createGame);
    router.put('/game/:id',gameController.updateGame);
};