import prisma from "../prisma";
import {logger} from "../helpers/loggers.vercel";
import {MsgForum} from "@prisma/client";


const forumService = {
    getAllMessages: async () => {
        try {
            return await prisma.msgForum.findMany(
                {
                    include: {
                        user: true,
                        like: true,
                        comments: true
                    }
                }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des messages: ${error}`);
        }
    },
    getMessageById: async (idMsgForum: number) => {
        try {
            return await prisma.msgForum.findUnique(
                {
                    where: {
                        idMsgForum
                    },
                    include: {
                        user: true,
                        like: true,
                        comments: true
                    }
                }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du message: ${error}`);
        }
    },
    addMsgForum: async (msg:string,idUser:string,title:string) => {
        try {
            return await prisma.msgForum.create({
                data: {
                    message: msg,
                    idUser: idUser,
                    title: title,
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout du message: ${error}`);
        }
    },
    addComment: async (data: any,id: number) => {
        try {
            return await prisma.comment.create({
                data: {
                    idMsgForum: id,
                    ...data
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout du commentaire: ${error}`);
        }
    },
    addLike: async (idMsgForum : number,idUser : string) => {
        try {
            return await prisma.like.create({
                data: {
                    idMsgForum: idMsgForum,
                    idUser: idUser
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout du like: ${error}`);
        }
    },
    findLike: async (idMsgForum : number,idUser : string) => {
        try {
            return await prisma.like.findFirst({
                where: {
                    idMsgForum: idMsgForum,
                    idUser: idUser
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du like: ${error}`);
        }
    },
    deleteLike: async (idMsgForum : number,idUser : string) => {
        try {
            return await prisma.like.deleteMany({
                where: {
                    idMsgForum: idMsgForum,
                    idUser: idUser
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du like: ${error}`);
        }
    },
    deleteMsgForum: async (idMsgForum: number) => {
        try {
            return await prisma.msgForum.delete({
                where: {
                    idMsgForum
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du message: ${error}`);
        }
    },
    findPostById: async (idMsgForum: number) => {
        try {
            return await prisma.msgForum.findUnique({
                where: {
                    idMsgForum
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du post: ${error}`);
        }
    },
    deleteComment: async (idComment: number) => {
        try {
            return await prisma.comment.delete({
                where: {
                    idComment
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du commentaire: ${error}`);
        }
    }
};

export default forumService;
