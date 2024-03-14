// Route pour ajouter une nouvelle présentation
import planingController from "../controllers/planing";
import express from "express";
export default (router: express.Router) => {
    router.get('/planing/:idUser/:idFestival', planingController.getPlaningForUser);
}