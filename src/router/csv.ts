import express from "express";
import upload from "../middlewares/uploadMiddleware";
import csvController from "../controllers/csvController";

export default (router: express.Router) => {
    router.post('/uploadCsv',upload.single('file'),csvController.uploadCsv);
};