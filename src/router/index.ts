import express from 'express';
import users from './users';
import oauth from "./oauth";
import authLocal from "./authLocal";
import csv from "./csv";
import game from "./game";


const router = express.Router();

export default (): express.Router => {
      oauth(router);
      users(router);
      authLocal(router);
      csv(router);
      game(router)
    return router;
  };