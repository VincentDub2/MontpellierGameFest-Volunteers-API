import express from "express";
import festivalController from "../controllers/festivalController";


export default (router: express.Router) => {
   router.post('/festival',festivalController.createAFestival);
    router.get('/festivals',festivalController.getAllFestivals);
    router.get('/festival/:id',festivalController.getFestivalById);
    router.delete('/festival/:id',festivalController.deleteFestivalById);
    router.put('/festival/:id',festivalController.updateFestival);
    router.get('/festival', festivalController.getLastFestival);
    router.get('/festivalCurrent', festivalController.getActiveFestival);
    router.get('/festivalNext', festivalController.getNextFestival);
    return router;
};