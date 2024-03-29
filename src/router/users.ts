import express from 'express';
import userController from "../controllers/user.controller";
import middleware from "../middlewares";
import upload from "../middlewares/uploadMiddleware";
import volunteerToFestivalController from "../controllers/volunteerToFestival.controller";

export default (router: express.Router) => {
    router.post('/emails/verify',userController.verifyEmail)
    router.get('/users/current',middleware.isAuthenticated,userController.getCurrentUser)
    router.get('/users/:id', userController.getUser);
    router.put('/users/profile-picture',middleware.isAuthenticated,upload.single('picture'),userController.updateUserPicture)
    router.put('/users/:id',middleware.isAuthenticated,middleware.isAccountOwner,userController.updateUser);
    router.get('/users/:volunteerId/festivals', volunteerToFestivalController.getFestivalsByVolunteer);

    return router;
};
