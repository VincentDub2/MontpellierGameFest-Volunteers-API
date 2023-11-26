import { Request, Response } from 'express';
import oauthService from '../services/oauth.service'; // Assurez-vous d'implémenter ce service

const oauthController = {
    // Rediriger l'utilisateur vers le fournisseur OAuth
    redirectToProvider: async (req: Request, res: Response) => {
        try {
            const provider = req.params.provider; // Exemple: 'google', 'facebook'
            const redirectUrl = await oauthService.getRedirectUrl(provider);
            res.redirect(redirectUrl);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la redirection vers le fournisseur OAuth" });
        }
    },

    // Gérer la réponse du fournisseur OAuth
    handleProviderCallback: async (req: Request, res: Response) => {
        try {
            const provider = req.params.provider;
            const { code } = req.query; // Le code d'autorisation fourni par le fournisseur OAuth

            const user = await oauthService.authenticateUser(provider, code as string);

            // Gérer la session utilisateur ici (création de session, génération de token JWT, etc.)
            // ...

            res.redirect('/some-redirect-uri-on-success');
        } catch (error) {
            res.redirect('/some-redirect-uri-on-failure');
        }
    }
};

export default oauthController;
