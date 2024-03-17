/**
 * Ce fichier permet de gérer le forum de l'application
 */
import { Request, Response } from "express";
import forumService from "../services/forum.service";
import { logger } from "../helpers/loggers.vercel";

const forumController = {
    /**
     * Récupérer tous les messages
     * @param req
     * @param res
     */
    getAllMessages: async (req: Request, res: Response) => {
        try {
            const messages = await forumService.getAllMessages();
            logger.info(`Récupération de tous les messages avec succès`);
            res.json(messages);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des messages: ${error}`);
            res.status(500).json({message: "Erreur lors de la récupération des messages :" + error});
        }
    },
    /**
     * Récupérer un message par son id
     * @param req
     * @param res
     */
    getMessageById: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (!id){
                logger.error(`Erreur lors de la récupération du message: id invalide`);
                res.status(500).json({ message: "Erreur lors de la récupération du message : id invalide" });
            }
            const message = await forumService.getMessageById(id);
            logger.info(`Récupération du message avec succès`);
            res.json(message);
        } catch (error) {
            logger.info(`Erreur lors de la récupération du message: ${error}`);
            res.status(500).json({ message: "Erreur lors de la récupération du message :" + error });
        }
    },
    /**
     * Ajouter un message
     * @param req
     * @param res
     */
    addMsgForum: async (req: Request, res: Response) => {
        try {

            const idUser = req.body.idUser;
            const messageReq = req.body.message;
            const title = req.body.title;

            if (!messageReq ){
                logger.error(`Erreur lors de l'ajout du message: message invalide`);
                return res.status(500).json({ message: "Erreur lors de l'ajout du message : message invalide" });
            }
            if (!idUser){
                logger.error(`Erreur lors de l'ajout du message: idUser invalide`);
                return res.status(500).json({ message: "Erreur lors de l'ajout du message : idUser invalide" });
            }
            if (!title){
                logger.error(`Erreur lors de l'ajout du message: titre invalide`);
                return res.status(500).json({ message: "Erreur lors de l'ajout du message : titre invalide" });
            }
            const message = await forumService.addMsgForum(messageReq, idUser,title);
            logger.info(`Ajout du message avec succès`);
            res.json(message);
        } catch (error) {
            logger.error(`Erreur lors de l'ajout du message: ${error}`);
            res.status(500).json({ message: "Erreur lors de l'ajout du message :" + error });
        }
        },
    /**
     * Ajouter un commentaire
     * @param req
     * @param res
     */
    addComment: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const comment = await forumService.addComment(req.body, id);
            logger.info(`Ajout du commentaire avec succès`);
            res.json(comment);
        } catch (error) {
            logger.error(`Erreur lors de l'ajout du commentaire: ${error}`);
            res.status(500).json({ message: "Erreur lors de l'ajout du commentaire :" + error });
        }
        },
    /**
     * Supprimer un message par son id
     * @param req
     * @param res
     */
    deleteMessageById: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const message = await forumService.deleteMsgForum(id);
            logger.info(`Suppression du message avec succès`);
            res.json(message);
        } catch (error) {
            logger.error(`Erreur lors de la suppression du message: ${error}`);
            res.status(500).json({ message: "Erreur lors de la suppression du message :" + error });
        }},
    /**
     * Ajouter un like
     * @param req
     * @param res
     */
    addLike: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const like = await forumService.addLike(id, req.body.idUser);
            logger.info(`Ajout du like avec succès`);
            res.json(like);
        } catch (error) {
            logger.error(`Erreur lors de l'ajout du like: ${error}`);
            res.status(500).json({ message: "Erreur lors de l'ajout du like :" + error });
        }},
    /**
     * Supprimer un like
     * @param req
     * @param res
     */
    deleteLike: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const like = await forumService.deleteLike(id, req.body.idUser);
            logger.info(`Suppression du like avec succès`);
            res.json(like);
        } catch (error) {
            logger.error(`Erreur lors de la suppression du like: ${error}`);
            res.status(500).json({ message: "Erreur lors de la suppression du like :" + error });
        }},

    /**
     * Supprimer un commentaire par son id
     * @param req
     * @param res
     */
    deleteComment: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const comment = await forumService.deleteComment(id);
            logger.info(`Suppression du commentaire avec succès`);
            res.json(comment);
        } catch (error) {
            logger.error(`Erreur lors de la suppression du commentaire: ${error}`);
            res.status(500).json({ message: "Erreur lors de la suppression du commentaire :" + error });
        }
        },
};

export default forumController;