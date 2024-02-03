import express from 'express';
import users from './users';
import oauth from "./oauth";
import authLocal from "./authLocal";
import csv from "./csv";
import game from "./game";
import festival from "./festival";
import association from "./association";
import userAssociation from "./userAssociation";
import poste from "./poste";
import creneau from "./creneau";
import event from "./event";
import espace from "./espace";
import posteEspace from "./posteEspace";
import referent from "./referent";
import creneauEspace from "./creneauEspace";
import isPresent from "./isPresent";
import isPlay from "./IsPlay";
import isPresented from "./isPresented";
import inscription from './inscription';

const router = express.Router();

export default (): express.Router => {
      oauth(router);
      users(router);
      authLocal(router);
      csv(router);
      game(router)
      festival(router)
      association(router)
      userAssociation(router)
      poste(router)
      creneau(router)
      event(router)
      espace(router)
      posteEspace(router)
      referent(router)
      creneauEspace(router)
      isPresent(router)
      isPlay(router)
      isPresented(router)
      inscription(router)
    return router;
  };