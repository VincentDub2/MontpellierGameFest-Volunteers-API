import jwt from 'jsonwebtoken';
import {NextFunction, Request,Response} from "express";
import userService from '../services/user.service';
import {User} from "@prisma/client";
import * as constants from "constants";

const middleware = {
    isAuthenticated : async (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("le token",token);
    if (!token) {
        return res.status(401).json({ message: "Authentification requise" });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET manquant dans le fichier .env');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("le decoded",decoded);

        if (typeof decoded === 'object' && 'userId' in decoded) {
            const user = await userService.findUserById(decoded.userId);// Assurez-vous que le type User correspond au payload JWT
            if (!user) {
                return res.status(401).json({ message: "User introuvable" });
            }
            req.user = user;
            next();
        } else {
            res.status(401).json({ message: "Token invalide" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Erreur d'authentification" });
    }
    },
    isEmailVerified : async (req : Request, res : Response, next : NextFunction) => {
        try {
            if (!req.user) {
                return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
            }
            const user = await userService.findUserById(req.user.id) ;
            if (!user || !user.emailVerified) {
                return res.status(403).json({ message: "Email non vérifié" });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la vérification de l'email" });
        }},
    isAccountOwner : (req :Request, res : Response, next : NextFunction) => {
        if (!req.user) {
            return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
        }
        const userId = req.user.id;
        const accountIdToModify = req.params.userId;
        if (userId !== accountIdToModify) {
            return res.status(403).json({ message: "Action non autorisée" });
        }
        next();
    }
};

export default middleware;

