import express from "express";
import forumController from "../controllers/forum.controller";
import middleware from "../middlewares";

export default (router: express.Router) => {
    router.post('/forum', forumController.addMsgForum);
    router.get('/forum', forumController.getAllMessages);
    router.get('/forum/:id', forumController.getMessageById);
    router.delete('/forum/:id', forumController.deleteMessageById);
    router.post('/forum/:id/comment', forumController.addComment);
    router.post('/forum/:id/like', forumController.like);
    router.delete('/forum/comment/:id', forumController.deleteComment);
    return router;
};