import {User, Status, Role} from "@prisma/client"; // Importez votre modèle User

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


export interface VolunteerInterface {
    volunteerId: string;
    festivalId: number;
    isVege? : boolean;
    sizeTeeShirt?: string;
    role?: Role;
    status?: Status;
    getTeeShirt?: boolean;
}

export interface UserRequest extends express.Request {
    user?: User;
}