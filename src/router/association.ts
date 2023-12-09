import express from "express";
import associationController from "../controllers/associationCrontroller";

export default (router: express.Router) => {
    router.get('/associations',associationController.getAllAssociations);
    router.get('/association/:id',associationController.getAssociationById);
    router.delete('/association/:id',associationController.deleteAssociation);
    router.post('/association',associationController.createAssociation);
    router.put('/association/:id',associationController.updateAssociation);
};

