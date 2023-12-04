import Papa from 'papaparse';
import fs from 'fs';
import { Request, Response } from 'express';

const csvController = {
    uploadCsv: async (req : Request, res : Response) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json("Aucun fichier n'a été uploadé.");
            }

            const filePath = file.path;
            const fileContent = fs.readFileSync(filePath, 'utf8');

            Papa.parse(fileContent, {
                header: true,
                complete: (results) => {
                    console.log("Analyse CSV terminée : ", results.data);

                    // Ici, vous pouvez traiter les données du CSV
                    // Par exemple, enregistrer dans la base de données, etc.

                    res.status(200).send("Fichier CSV traité avec succès.");
                },
                error: (error : Error) => {
                    console.error("Erreur d'analyse CSV : ", error);
                    res.status(500).send("Erreur lors de l'analyse du fichier CSV.");
                }
            });

            // Supprimez le fichier après traitement
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error("Erreur de traitement CSV : ", error);
            res.status(500).send("Erreur lors du traitement du fichier CSV.");
        }
    }
};

export default csvController;
