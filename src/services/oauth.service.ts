import axios from 'axios';
import prisma from '../prisma';
import {stringify} from "ts-jest";
import {User} from "@prisma/client";


interface UserProfile {
    id: number;
    email: string;
    providerId: string; // ID unique du fournisseur OAuth (ex : "Google")
    providerUserId: string; // ID utilisateur attribué par le fournisseur OAuth
    accessToken: string; // Token d'accès OAuth
    refreshToken?: string; // Token de rafraîchissement OAuth (peut être null)
    name: string;
}

type Provider = 'google' | 'facebook' | 'twitter' | 'github' | 'linkedin' | 'microsoft';

type Token = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    id_token: string;
}

const oauthService = {
    // Obtenez l'URL de redirection pour un fournisseur spécifique
    // Utilisez les informations de configuration de votre fournisseur OAuth
    getRedirectUrl : async (provider: string): Promise<string> => {
        if (provider === "google") {
            const clientId = process.env.GOOGLE_CLIENT_ID;
            const redirectUri = process.env.GOOGLE_REDIRECT_URI;
            const scopes = ['email', 'profile'].join(' '); // Définissez-les scopes nécessaires
            return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&access_type=offline&prompt=consent`;
        }
        // Ajoutez des cas pour d'autres fournisseurs si nécessaire
        throw new Error('Fournisseur OAuth non pris en charge');
    },

    // Authentifier ou créer un utilisateur après le callback OAuth
    authenticateUser: async (provider: string, code: string): Promise<User> => {
        // Échangez le code contre un token d'accès auprès du fournisseur OAuth
        const accessToken = await exchangeCodeForAccessToken(provider, code);

        // Obtenez les informations de l'utilisateur auprès du fournisseur OAuth en utilisant le token d'accès
        const userProfile = await fetchUserProfile(provider, accessToken.access_token);

        // Recherchez l'utilisateur dans votre base de données ou créez-en un nouveau
        let user = await findOrCreateUser(userProfile,accessToken);

        return user;
    }
};

const exchangeCodeForAccessToken = async (provider: string, code: string): Promise<Token> => {
    console.log("exchange ",provider);
    if (provider === "google") {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;

        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        });
        return response.data;
    }
    throw new Error('Fournisseur OAuth non pris en charge');
};

const fetchUserProfile = async (provider: string, accessToken: string): Promise<any> => {
    if (provider === "google") {
        const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("response ",response.data);

        return response.data; // Contiendra l'email, le nom, etc.
    }
    throw new Error('Fournisseur OAuth non pris en charge');
};


const findOrCreateUser = async (userProfile: UserProfile,token : Token): Promise<User> => {
    const { email, providerId, providerUserId, accessToken, refreshToken,name,id} = userProfile;

    console.log("UserProfile ",userProfile);


    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        try {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    emailVerified: true,
                    authOAuth: {
                        create: {
                            providerId: 'google', // ou autre fournisseur
                            provider: 'google', // ou autre fournisseur
                            providerUserId: stringify(id), // ID utilisateur attribué par le fournisseur OAuth
                            accessToken : token.access_token, // Token d'accès, si vous le stockez
                            refreshToken : token.refresh_token, // Token de rafraîchissement, si vous le stockez

                            // Autres champs nécessaires pour OAuthAccount
                        },
                    },
                },
            })
        } catch (error) {
            console.log(error);
        }
    }
    if (!user) {
        throw new Error('Impossible de créer ou de trouver un utilisateur');
    }
    return user;
};
export { UserProfile, oauthService, exchangeCodeForAccessToken, fetchUserProfile, findOrCreateUser };
export default oauthService;
