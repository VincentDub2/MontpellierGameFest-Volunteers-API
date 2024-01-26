import express from "express";
import userAssociationController from "../controllers/userAssociation.controller";

export default (router: express.Router) => {
    router.post('/associations/:associationId/user/:userId',userAssociationController.addUserToAssociation);
    router.get('/users/:userId/associations',userAssociationController.getUserAssociations);
    router.get('/associations/:associationId/users',userAssociationController.getAssociationUsers);
    router.delete('/associations/:associationId/user/:userId',userAssociationController.deleteUserAssociation);
};

