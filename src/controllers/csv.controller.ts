import Papa from 'papaparse';
import { Request, Response } from 'express';
import csvService from "../services/csv.service";

const csvController = {
    uploadCsv: async (req: Request, res: Response) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json("Aucun fichier n'a été upload.");
            }

            // Utilisez 'file. Buffer' au lieu de lire depuis un fichier sur le disque
            const fileContent = file.buffer.toString('utf8');

            Papa.parse(fileContent, {
                header: true,
                complete: async (results) => {
                    try {
                        const createdGames = await csvService.processAndSaveGameData2(results.data);
                        res.status(200).json({ message: "Fichier CSV traité avec succès.", createdGames });
                    } catch (error) {
                        console.error("Erreur lors de l'enregistrement en base de données : ", error);
                        res.status(500).send("Erreur lors de l'enregistrement des données.");
                    }
                },
                error: (error : Error) => {
                    console.error("Erreur d'analyse CSV : ", error);
                    res.status(500).send("Erreur lors de l'analyse du fichier CSV.");
                }
            });

        } catch (error) {
            console.error("Erreur de traitement CSV : ", error);
            res.status(500).send("Erreur lors du traitement du fichier CSV.");
        }
    }
};

export default csvController;
