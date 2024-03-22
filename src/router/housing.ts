import express from "express";
import housingController from "../controllers/housing.controller";


export default (router: express.Router) => {
    router.post('/housings',housingController.addHousing);
    router.get('/housings',housingController.getAllHousing);
    router.get('/housings/:id',housingController.getHousingById);
    router.delete('/housings/:id',housingController.deleteHousingById);
    return router;
};