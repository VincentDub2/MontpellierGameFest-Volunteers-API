import express from "express";
import upload from "../middlewares/uploadMiddleware";
import csvController from "../controllers/csv.controller";

export default (router: express.Router) => {
    router.post('/uploads/csv',upload.single('file'),csvController.uploadCsv);
};