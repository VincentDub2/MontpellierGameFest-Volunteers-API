import {User} from "@prisma/client"; // Importez votre modèle User

import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export interface UserRequest extends express.Request {
    user?: User;
}