import prisma from "../prisma";
import {assignWith} from "lodash";
import {logger} from "../helpers/loggers.vercel";
import {GameData} from "../types/modelGame";


function transformToGameData(data: any): GameData {
    return {
        idGame: parseInt(data.idJeu),
        name: data['Nom du jeu'],
        author: data.Auteur,
        publisher: data['Éditeur'],
        numberOfPlayers: data['nb joueurs'],
        minAge: data['âge min'],
        duration: data['Durée'],
        type: data.Type,
        instructionLink: data.Notice,
        playArea: data['Zone plan'],
        volunteerArea: data['Zone bénévole'],
        idZone: parseInt(data.idZone),
        toAnimate: data['À animer'] === 'oui',
        received: data['Reçu'] === 'oui',
        mechanisms: data['Mécanismes'],
        themes: data['Thèmes'],
        tags: data.Tags,
        description: data.Description,
        imageUrl: data.Image,
        logoUrl: data.Logo,
        videoUrl: data['Vidéo']
    };
}

const csvService = {
    /**
     * Process and save game data from CSV file
     * Il est recommandé d'utiliser Promise.all() pour paralléliser le traitement des données
     * Il est beaucoup plus rapide de traiter les données en parallèle que de traiter les données une par une
        * @param csvData
     * @returns {Promise<void>}
     *
     */
    async processAndSaveGameData2(csvData : any[]) {
        console.time('TraitementTotal');
        const existingGames = new Set((await prisma.jeux.findMany()).map(game => game.idGame));
    
        const batchSize = 500; // Taille de chaque groupe
        const createdGames = [];
    
        for (let i = 0; i < csvData.length; i += batchSize) {
            const batch = csvData.slice(i, i + batchSize);
            const batchResult = await Promise.all(batch.map(data => this.processGame(transformToGameData(data), existingGames)));
            createdGames.push(...batchResult.flat());
        }
        console.timeEnd('TraitementTotal');
        return createdGames.flat();
    },
    async processGame(data : GameData, existingGames : Set<number>) {
        try {
            const idGame = data.idGame;
            if (existingGames.has(idGame)) {
                const createdGame = await prisma.jeux.update({
                    where: { idGame },
                    data: data
                });
                return createdGame.idGame; // Return the updated idGame
            } else {
                const createdGame = await prisma.jeux.create({
                    data: data
                });
                return createdGame.idGame; // Return the created idGame
            }
        } catch (error) {
            logger.error(`Erreur lors de l'enregistrement du jeu ${data.name}:`, error);
            return null; // Return null for failed creations
        }
    },

    async processGame2(data: GameData) {
        return prisma.jeux.upsert({
            where: { idGame: data.idGame },
            update: data,
            create: data,
        });
    },
    async processAndSaveGameData3(csvData: any[]) {
        console.time('TraitementTotal');
        let createdGames = [];
        const batchSize = 100;

        for (let i = 0; i < csvData.length; i += batchSize) {
            const batch = csvData.slice(i, i + batchSize);
            const operations = batch.map(data => {
                // Transformez les données ici
                const gameData = transformToGameData(data);
                // Retournez l'opération upsert directement sans l'utiliser avec `await`
                return prisma.jeux.upsert({
                    where: { idGame: gameData.idGame },
                    update: gameData,
                    create: gameData,
                });
            });

            // Exécutez toutes les opérations de ce lot dans une seule transaction
            const batchResult = await prisma.$transaction(operations);
            createdGames.push(...batchResult);
        }
        console.timeEnd('TraitementTotal');
        return createdGames; // Ce sera un tableau des résultats de toutes les opérations upsert
    },



    /**
     * Process and save game data from CSV file
     * Cette methode est plus lente que la methode processAndSaveGameData2
     * @param csvData
     */
    async processAndSaveGameData(csvData : any[]) {
        console.time('TraitementTotal');
        const existingGames = new Set((await prisma.jeux.findMany()).map(game => game.idGame));
        for (const data of csvData) {
            try {
                const game = transformToGameData(data);

                if (existingGames.has(game.idGame)) {
                    await prisma.jeux.update({
                        where: {idGame: game.idGame},
                        data: game
                    });
                    logger.info(`Jeu ${game.name} mis à jour avec succès`)
                }
                else {
                    await prisma.jeux.create({
                        data: game
                    })
                logger.info(`Jeu ${game.name} enregistré avec succès`)
                ;}
            } catch (error) {
                logger.error(`Erreur lors de l'enregistrement du jeu ${data['Nom du jeu']}:`, error);
            }
        }
        console.timeEnd('TraitementTotal');
    }

}

export default csvService;