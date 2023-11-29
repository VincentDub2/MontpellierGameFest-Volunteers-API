import express from 'express';
import userController from "../controllers/userController";
import middleware from "../middlewares";

export default (router: express.Router) => {
    router.get('/verify-email',userController.verifyEmail)
    router.get('/currentUser',middleware.isAuthenticated,userController.getCurrentUser)
    return router;
};
