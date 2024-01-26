import express from "express";
import eventController from "../controllers/event.controller";

export default (router: express.Router) => {
    // Route pour ajouter un nouvel événement
    router.post('/events', eventController.addEvent);

// Route pour obtenir un événement par son ID
    router.get('/events/:idEvent', eventController.getEventById);

// Route pour obtenir tous les événements
    router.get('/events', eventController.getAllEvents);

// Route pour mettre à jour un événement
    router.put('/events/:idEvent', eventController.updateEvent);

// Route pour supprimer un événement
    router.delete('/events/:idEvent', eventController.deleteEvent);
};