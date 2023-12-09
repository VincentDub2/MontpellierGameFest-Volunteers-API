import express from 'express';
import userController from "../controllers/userController";
import middleware from "../middlewares";
import multer from "multer";
import upload from "../middlewares/uploadMiddleware";

export default (router: express.Router) => {
    router.get('/verify-email',userController.verifyEmail)
    router.get('/currentUser',middleware.isAuthenticated,userController.getCurrentUser)
    router.put('/updateUserPicture',middleware.isAuthenticated,middleware.isEmailVerified,upload.single('picture'),userController.updateUserPicture)
    return router;
};
