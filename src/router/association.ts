import express from "express";
import associationController from "../controllers/association.controller";

export default (router: express.Router) => {
    router.get('/associations',associationController.getAllAssociations);
    router.get('/associations/:id',associationController.getAssociationById);
    router.delete('/associations/:id',associationController.deleteAssociation);
    router.post('/associations',associationController.createAssociation);
    router.put('/associations/:id',associationController.updateAssociation);
};

