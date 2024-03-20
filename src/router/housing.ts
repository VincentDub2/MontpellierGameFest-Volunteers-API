import express from "express";
import housingController from "../controllers/housing.controller";


export default (router: express.Router) => {
    router.post('/housing',housingController.addHousing);
    router.get('/housing',housingController.getAllHousing);
    router.get('/housing/:id',housingController.getHousingById);
    router.delete('/housing/:id',housingController.deleteHousingById);
    return router;
};