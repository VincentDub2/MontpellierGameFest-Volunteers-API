import jwt from 'jsonwebtoken';
import {NextFunction, Request,Response} from "express";
import userService from '../services/user.service';
import rateLimit from "express-rate-limit";
import {logger} from "../helpers/loggers.vercel";


const middleware = {
    isAuthenticated : async (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Authentification requise" });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET manquant dans le fichier .env');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


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
    
        const accountIdToModify = req.params.id;
    
        if (userId !== accountIdToModify) {
            return res.status(403).json({ message: "Action non autorisée" });
        }
        next();
    },
    // Créez une instance de limite de taux
     limiter : rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limite chaque IP à 100 requêtes par `window` (ici, par 15 minutes)
        standardHeaders: true, // Retourne les informations de limite de taux dans les headers `RateLimit-*`
        legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
         handler: (req, res) => {
             logger.warn("Trop de requêtes effectuées depuis cette IP, veuillez réessayer après un certain temps.");
             res.status(429).json({
                 message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer après un certain temps."
             });
         },
    })
};

export default middleware;

