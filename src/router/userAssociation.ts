import express from "express";
import userAssociationController from "../controllers/userAssociationController";

export default (router: express.Router) => {
    router.post('/association/:associationId/user/:userId',userAssociationController.addUserToAssociation);
    router.get('/user/:userId/associations',userAssociationController.getUserAssociations);
    router.get('/association/:associationId/users',userAssociationController.getAssociationUsers);
    router.delete('/association/:associationId/user/:userId',userAssociationController.deleteUserAssociation);
};

