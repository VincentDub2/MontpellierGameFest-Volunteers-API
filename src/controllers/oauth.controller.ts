import { Request, Response } from 'express';
import oauthService from '../services/oauth.service';
import jwt from "jsonwebtoken";
import * as process from "process";
import {logger} from "../helpers/loggers.vercel"; // Assurez-vous d'implémenter ce service

const oauthController = {
    // Rediriger l'utilisateur vers le fournisseur OAuth
    redirectToProvider: async (req: Request, res: Response) => {
        try {
            const provider = req.params.provider; // Exemple: 'google', 'facebook'
            const redirectUrl = await oauthService.getRedirectUrl(provider);
            logger.info(`Redirection de l'utilisateur vers le fournisseur OAuth: ${provider}`);
            res.redirect(redirectUrl);
        } catch (error) {
            logger.error(`Erreur lors de la redirection de l'utilisateur vers le fournisseur OAuth: ${error}`);
            res.status(500).json({ message: "Erreur lors de la redirection vers le fournisseur OAuth" });
        }
    },

    // Gérer la réponse du fournisseur OAuth
    handleProviderCallback: async (req: Request, res: Response) => {
        try {
            const provider = req.params.provider;
            const { code } = req.query; // Le code d'autorisation fourni par le fournisseur OAuth

            const user = await oauthService.authenticateUser(provider, code as string);

            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET manquant dans le fichier .env');
            }

            // Générer un token JWT
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            logger.info(`Utilisateur authentifié avec succès avec le fournisseur OAuth: ${provider}`);
            res.redirect(`${process.env.FRONTEND_URL}/oauth2/callback?token=${token}`);
        } catch (error) {
            logger.error(`Erreur lors de la gestion de la réponse du fournisseur OAuth: ${error}`);
            res.redirect('/some-redirect-uri-on-failure');
        }
    }
};

export default oauthController;
