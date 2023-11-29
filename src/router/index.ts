import express from 'express';
import users from './users';
import oauth from "./oauth";
import authLocal from "./authLocal";


const router = express.Router();

export default (): express.Router => {
      oauth(router);
      users(router);
      authLocal(router);
    return router;
  };