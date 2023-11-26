import express from 'express';
import userController from "../controllers/userController";

export default (router: express.Router) => {
    router.get('/users',userController.getAllUsers);
    router.post('/user',userController.createUsers);
    return router;
};
