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
        // Par exemple, si csvData contient 1000 éléments et batchSize = 100, alors nous aurons 10 groupes
        for (let i = 0; i < csvData.length; i += batchSize) {
            const batch = csvData.slice(i, i + batchSize);
            const promises = batch.map(data => this.processGame(transformToGameData(data)));
            await Promise.all(promises);
        }

        console.timeEnd('TraitementTotal');
    },
    processGame(data: GameData) {
        // Directement retourner l'opération Prisma ici sans `await`
        return prisma.jeux.upsert({
            where: { idGame: data.idGame },
            update: data,
            create: data,
        });
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