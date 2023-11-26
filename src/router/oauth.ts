import express from 'express';
import oauthController from '../controllers/oauthController'; // Assurez-vous que le chemin est correct
// Importez d'autres contrôleurs et middlewares comme nécessaire

export default (router: express.Router) => {
    // Vos routes existantes
    // ...

    // Route pour rediriger vers le fournisseur OAuth (ex : Google, Facebook)
    router.get('/auth/:provider', oauthController.redirectToProvider);

    // Route pour gérer le callback du fournisseur OAuth
    router.get('/auth/:provider/callback', oauthController.handleProviderCallback);

    // Vos autres routes
    // ...
};
