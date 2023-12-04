import express from 'express';
import users from './users';
import oauth from "./oauth";
import authLocal from "./authLocal";
import csv from "./csv";


const router = express.Router();

export default (): express.Router => {
      oauth(router);
      users(router);
      authLocal(router);
      csv(router);
    return router;
  };