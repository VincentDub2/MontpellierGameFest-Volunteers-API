import {User} from "@prisma/client"; // Importez votre modèle User

import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
declare module 'express-serve-static-core' {
    interface Request {
        file: Express.Multer.File;
    }
}



export interface UserRequest extends express.Request {
    user?: User;
}
