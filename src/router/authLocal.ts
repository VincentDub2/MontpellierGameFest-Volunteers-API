import express from 'express';
import userController from "../controllers/userController";
import authLocalController from "../controllers/authLocalController";
import authLocalService from "../services/authLocal.service";

export default (router: express.Router) => {
    router.post('/login',authLocalController.login);
    router.post('/register',authLocalController.register);
    router.post('/reset-password', authLocalController.resetPassword);
    router.post('/update-password-with-token', authLocalController.updatePasswordWithToken);
    return router;
};