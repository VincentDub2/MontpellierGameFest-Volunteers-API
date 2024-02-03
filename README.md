# 🎉 Application de Gestion des Utilisateurs pour le Festival du Jeu à Montpellier

## 📜 Contexte
Cette application web est conçue pour le cadre universitaire et destinée à la gestion des bénévoles pour le festival du jeu à Montpellier.

## ✨ Fonctionnalités
- Gestion des utilisateurs
- Authentification et enregistrement
- Gestion des bénévoles

## 🚀 Routes de l'API

- `/auth/:provider` - Authentification avec un fournisseur externe.
- `/auth/:provider/callback` - Callback après l'authentification avec un fournisseur externe.
- `/login` - Connexion d'un utilisateur.
- `/register` - Enregistrement d'un nouvel utilisateur.
- `/users/current` - Obtenir l'utilisateur actuellement connecté.
- `/users/:id` - Obtenir ou mettre à jour les informations d'un utilisateur spécifique.
- `/emails/verify` - Vérification de l'adresse e-mail de l'utilisateur.
- `/reset-password` - Réinitialisation du mot de passe de l'utilisateur.
- `/update-password-with-token` - Mise à jour du mot de passe de l'utilisateur à l'aide d'un token.
- `/uploads/csv` - Téléchargement d'un fichier CSV.
- `/games` - Obtention de la liste de tous les jeux.
- `/games/:id` - Obtention, mise à jour ou suppression d'un jeu spécifique.
- `/festivals` - Obtention de la liste de tous les festivals ou ajout d'un nouveau festival.
- `/festivals/:id` - Obtention, mise à jour ou suppression d'un festival spécifique.
- `/festivals/last` - Obtention du dernier festival créé.
- `/festivals/current` - Obtention du festival actuellement en cours.
- `/festivals/next` - Obtention du prochain festival prévu.
- `/users/profile-picture` - Mise à jour de la photo de profil de l'utilisateur.
- `/associations` - Obtention de la liste de toutes les associations ou ajout d'une nouvelle association.
- `/associations/:id` - Obtention, mise à jour ou suppression d'une association spécifique.
- `/associations/:associationId/users/:userId` - Ajout d'un utilisateur à une association.
- `/users/:userId/associations` - Obtention des associations d'un utilisateur spécifique.
- `/users/:volunteerId/festivals` - Obtention des festivals auxquels un volontaire a participé.
- `/associations/:associationId/users` - Obtention des utilisateurs d'une association spécifique.
- `/associations/:associationId/users/:userId` - Suppression d'un utilisateur d'une association.

### Détails des Routes de l'API

#### 1. Authentification avec un Fournisseur (`/auth/:provider`)
Cette route permet à un utilisateur de s'authentifier via un fournisseur externe (par exemple, Google).
- **Exemple**: `GET /auth/google` pour démarrer le processus d'authentification avec Google.

#### 2. Callback d'Authentification (`/auth/:provider/callback`)
Après l'authentification avec le fournisseur, cette route gère la réponse et les données de l'utilisateur.
- **Exemple**: `GET /auth/google/callback` reçoit les données de l'utilisateur de Google et termine le processus d'authentification.

#### 3. Connexion (`/login`)
Permet à un utilisateur de se connecter en utilisant ses identifiants de l'application.
- **route**: `POST /login` 
- **Corps de la requête**: 
  - `email`: Nom d'utilisateur de l'utilisateur.
  - `password`: Mot de passe de l'utilisateur.
- **Exemple**: `POST /login` avec le corps de la requête contenant le nom d'utilisateur et le mot de passe.

#### 4. Enregistrement (`/register`)
Permet à un nouvel utilisateur de créer un compte.
- **Exemple**: `POST /register` avec les informations nécessaires à l'enregistrement (e-mail, nom d'utilisateur, mot de passe).
- Possibilité de fournir une photo de profil en utilisant le champ `picture` du corps de la requête.

#### 5. Utilisateur Actuel (`/users`)
Récupère les informations de l'utilisateur actuellement connecté.
- **Exemple**: `GET /users/current` renvoie les détails de l'utilisateur connecté.
Permet de modifier la photo de profil de l'utilisateur.
- **Exemple**: `POST /users/profile-picture` permet de modifier la photo de profil de l'utilisateur.
- **Exemple**: `put /users/:id` permet de modifier un utilisateur. Il faut envoyer un objet JSON avec les champs à modifier. Il faut être connecté pour pouvoir modifier un utilisateur. Il faut être le propriétaire du compte pour pouvoir modifier un utilisateur.
##### Récupérer les Festivals par Volontaire
- **Route**: `GET /users/:volunteerId/festivals`
- **Paramètres URL**:
  - `:volunteerId` - Identifiant unique du volontaire.
- **Paramètres de requête** (query parameters):
  - `page` - Numéro de la page pour la pagination (optionnel).
  - `pageSize` - Nombre de festivals à afficher par page (optionnel).
  - `role` - Rôle du volontaire dans le festival (optionnel).
  - `startDate` - Date de début pour filtrer les festivals (optionnel).
  - `endDate` - Date de fin pour filtrer les festivals (optionnel).
- **Exemple**: `GET /users/123/festivals?page=1&pageSize=10&role=administrateur&startDate=2021-01-01&endDate=2021-12-31`
  - Récupère les festivals auxquels le volontaire avec l'ID `123` a participé en tant qu'`administrateur` entre le 1er janvier 2021 et le 31 décembre 2021, affichant la première page avec 10 festivals par page.


#### 6. Vérification de l'E-mail (`/emails/verify`)
Permet à l'utilisateur de vérifier son adresse e-mail.
- **Exemple**: `POST /emails/verify` avec un token envoyé à l'adresse e-mail de l'utilisateur pour confirmer son identité.

#### 7. Réinitialisation du Mot de Passe (`/reset-password`)
Permet à l'utilisateur de réinitialiser son mot de passe.
- **Exemple**: `POST /reset-password` avec l'adresse e-mail de l'utilisateur pour recevoir un lien de réinitialisation du mot de passe.
- **Exemple**: `POST /update-password-with-token` avec le token envoyé à l'adresse e-mail de l'utilisateur pour réinitialiser son mot de passe.

#### 8. Importation d'un Fichier CSV (`/uploads/csv`)
Permet d'importer un fichier CSV contenant les informations des bénévoles.
Ps : le fichier CSV doit être envoyé dans le corps de la requête avec le nome 'file'.
Note : Utilisation de la librairie 'csv-parser' pour parser le fichier CSV.
Les requêtes sont effectuées en parallel pour optimiser le délai.
- **Exemple**: `POST /uploads/csv` avec un fichier CSV contenant les informations des bénévoles.

### 9. Jeux (`/games`)
Permet de récupérer la liste des jeux.
- **Exemple**: `GET /games` renvoie la liste des jeux.
- **Exemple**: `GET /games?name=monopoly` renvoie la liste des jeux dont le nom contient "monopoly".
- **Exemple**: `GET /games?pageSize=10` renvoie les 10 premiers jeux.
- **Exemple**: `GET /games?page=2` renvoie les jeux de la page 2.
- **Exemple**: `GET /games?page=1&pageSize=20` renvoie les 20 premiers jeux de la page 1.

- **Exemple**: `GET /games/:id` renvoie le jeu avec l'id correspondant.
- **Exemple**: `POST /games` permet d'ajouter un jeu.
- **Exemple**: `PUT /gams/:id` permet de modifier un jeu.
- **Exemple**: `DELETE /games/:id` permet de supprimer un jeu.

### 10. Festivals (`/festivals`)
- **Exemple**:  `POST /festivals` permet d'ajouter un nouveau festival.
- **Exemple**: `GET /festivals` renvoie la liste de tous les festivals.
- **Exemple**: `GET /festivals/:id` renvoie le festival avec l'ID correspondant.
- **Exemple**: `PUT /festivals/:id` permet de modifier un festival existant.
- **Exemple**: `DELETE /festivals/:id` permet de supprimer un festival.
- **Exemple**: `GET /festivals/last` renvoie le dernier festival créé.
- **Exemple**: `GET /festivals/current` renvoie le festival actuellement en cours.
- **Exemple**: `GET /festivals/next` renvoie le prochain festival prévu.

Gestion des Volontaires dans les Festivals (`/festivals/:festivalId/volunteers`)
Cette section couvre les opérations liées aux volontaires dans les festivals.

- **Exemple**: `POST /festivals/:festivalId/volunteers` permet d'ajouter un volontaire à un festival spécifique.
- **Exemple**: `DELETE /festivals/:festivalId/volunteers/:volunteerId` permet de supprimer un volontaire d'un festival spécifique.
- **Exemple**: `GET /festivals/:festivalId/volunteers/:volunteerId` renvoie les informations d'un volontaire spécifique dans un festival.
- **Exemple**: `GET /festivals/:festivalId/volunteers` renvoie la liste de tous les volontaires pour un festival spécifique.
Paramètres de requête :
    - page et pageSize - (optionnel) permettent la pagination des résultats. page indique la page actuelle, et pageSize le nombre de résultats par page.
    - role - (optionnel) filtre les volontaires par leur rôle (par exemple, administrateur, manager de réception, etc.). La validation s'assure que le rôle fourni correspond aux valeurs définies dans l'énumération Role.
    - name - (optionnel) permet de filtrer les volontaires par leur nom.
- **Exemple**: `PUT /festivals/:festivalId/volunteers/:volunteerId` permet de mettre à jour les informations d'un volontaire dans un festival.
Corps de la requête :
    - il n'est pas nécessaire d'inclure tous les champs dans le corps de la requête. Seuls les champs à mettre à jour doivent être inclus.
    - isVege - indique si le volontaire suit un régime végétarien.
    - sizeTeeShirt - la taille de tee-shirt du volontaire.
    - role - le rôle du volontaire dans le festival. Comme pour la route getVolunteersToFestival, une validation est effectuée pour s'assurer que le rôle fourni est valide.

#### Obtenir tous les Postes d'un Festival (`/festivals/:idFestival/postes`)
- **Exemple**: `GET /festivals/:idFestival/postes` permet de récupérer tous les postes associés à un festival spécifique.
Paramètres de requête :
    - name - (optionnel) permet de filtrer les postes par leur nom.

#### Obtenir tous les Créneaux pour un Festival Donné (`/festivals/:idFestival/creneaux`)
- **Route**: `GET /festivals/:idFestival/creneaux`
- **Paramètres URL**:
  - `idFestival`: Identifiant unique du festival pour lequel les créneaux sont demandés.
- **Paramètres de requête** (query parameters) (optionnels):
  - `timeStart`: Date et heure de début pour filtrer les créneaux (format DateTime).
  - `timeEnd`: Date et heure de fin pour filtrer les créneaux (format DateTime).
  - `idEspace`: Identifiant de l'espace associé aux créneaux.
  - `idPoste`: Identifiant du poste associé aux créneaux. (Ne marche pas)
- **Exemple**: `GET /festivals/1/creneaux?timeStart=2024-06-10T08:00:00&timeEnd=2024-06-10T12:00:00&idEspace=2&idPoste=5`
  - Récupère tous les créneaux du festival avec l'ID `1` qui se déroulent entre 8h et 12h le 10 juin 2024, associés à l'espace avec l'ID `2` et au poste avec l'ID `5`.

### 11. Créneaux (`/creneaux`)
Gestion des créneaux pour les festivals, y compris l'ajout, la consultation, la mise à jour et la suppression des créneaux.

#### Ajouter un Créneau (`/creneaux`)
- **Route**: `POST /creneaux`
- **Corps de la requête**: 
  - `timeStart`: Date et heure de début du créneau (DateTime).
  - `timeEnd`: Date et heure de fin du créneau (DateTime).
  - `idFestival`: Identifiant du festival associé (Int).
- **Exemple**: `POST /creneaux` avec le corps de la requête contenant `{"timeStart": "2024-06-10T08:00:00", "timeEnd": "2024-06-10T12:00:00", "idFestival": 1}` pour créer un nouveau créneau.

#### Ajouter plusieurs Créneaux (`/creneaux/multiple`)
- **Route**: `POST /creneaux/multiple`
- **Corps de la requête**: 
  - `creneaux`: Tableau contenant les détails des créneaux à ajouter.
- **Exemple**: `POST /creneaux/multiple` avec le corps de la requête contenant `{"creneaux": [{"timeStart": "2024-06-10T08:00:00", "timeEnd": "2024-06-10T12:00:00", "idFestival": 1}, {"timeStart": "2024-06-10T14:00:00", "timeEnd": "2024-06-10T18:00:00", "idFestival": 1}]}` pour créer deux nouveaux créneaux.

#### Obtenir un Créneau par ID (`/creneaux/:idCreneau`)
- **Route**: `GET /creneaux/:idCreneau`
- **Paramètres URL**:
  - `idCreneau`: Identifiant unique du créneau.
- **Exemple**: `GET /creneaux/123` pour obtenir les détails du créneau avec l'ID `123`.

#### Mettre à Jour un Créneau (`/creneaux/:idCreneau`)
- **Route**: `PUT /creneaux/:idCreneau`
- **Paramètres URL**:
  - `idCreneau`: Identifiant unique du créneau.
- **Corps de la requête**: 
  - `timeStart` (optionnel) : Nouvelle heure de début.
  - `timeEnd` (optionnel) : Nouvelle heure de fin.
- **Exemple**: `PUT /creneaux/123` avec le corps de la requête pour mettre à jour le créneau `123`.

#### Supprimer un Créneau (`/creneaux/:idCreneau`)
- **Route**: `DELETE /creneaux/:idCreneau`
- **Paramètres URL**:
  - `idCreneau`: Identifiant unique du créneau.
- **Exemple**: `DELETE /creneaux/123` pour supprimer le créneau avec l'ID `123`.


### 12 . Association (`/associations`)
- **Exemple**: `GET /associations` renvoie la liste des associations.
- **Exemple**: `GET /associations?name=runningClub` renvoie la liste des associations dont le nom contient "runningClub".
- **Exemple**: `GET /associations?pageSize=10` renvoie les 10 premières associations.
- **Exemple**: `GET /associations?page=2` renvoie les associations de la page 2.
- **Exemple**: `GET /associations?page=1&pageSize=20` renvoie les 20 premières associations de la page 1.

- **Exemple**: `GET /associations/:id` renvoie l'association avec l'id correspondant.
- **Exemple**: `POST /associations` permet d'ajouter une association.
- **Exemple**: `PUT /associations/:id` permet de modifier une association.
- **Exemple**: `DELETE /associations/:id` permet de supprimer une association.

- **Exemple**: `POST /associations/:associationId/user/:userId` permet d'ajouter un utilisateur à une association.
- **Exemple**: `GET /users/:userId/associations` permet de récupérer les associations d'un utilisateur.
- **Exemple**: `GET /associations/:associationId/users` permet de récupérer les utilisateurs d'une association.
- **Exemple**: `DELETE /associations/:associationId/user/:userId` permet de supprimer un utilisateur d'une association.

### 13. Postes (`/postes`)
Gestion des postes pour le festival, y compris l'ajout, la récupération et la mise à jour des informations des postes.

#### Ajouter un Poste (`/postes`)
- **Route**: `POST /postes`
- **Corps de la requête**:
  - `name`: Nom du poste.
  - `capacity`: Capacité du poste (nombre).
  - `idFestival`: Identifiant du festival.
  - `description`: Description du poste.
- **Exemple**: `POST /postes` avec le corps de la requête contenant `{"name": "Poste 1", "capacity": 30, "idFestival": 1, "description": "Description du poste 1"}` pour créer un nouveau poste.


#### Ajouter Plusieurs Postes (`/postes/multiple`)
- **Route**: `POST /postes/multiple`
- **Corps de la requête**:
  - `postes`: Tableau contenant les détails des postes à ajouter.
- **Exemple**: `POST /postes/multiple` permet d'ajouter plusieurs postes en une seule requête. Les détails des postes doivent être envoyés dans le corps de la requête sous forme d'un tableau.

#### Obtenir un Poste par ID (`/postes/:idPoste`)
- **Route**: `GET /postes/:idPoste`
- **Paramètres URL**:
  - `idPoste`: Identifiant unique du poste.
- **Exemple**: `GET /postes/:idPoste` permet de récupérer les détails d'un poste spécifique à l'aide de son ID.

#### Mettre à jour un Poste (`/postes/:idPoste`)
- **Route**: `PUT /postes/:idPoste`
- **Paramètres URL**:
  - `idPoste`: Identifiant unique du poste.
- **Corps de la requête**:
  - `name` (optionnel) : Nouveau nom du poste.
  - `capacity` (optionnel) : Nouvelle capacité du poste.
  - `description` (optionnel) : Nouvelle description du poste.
- **Exemple**: `PUT /postes/:idPoste` permet de mettre à jour les détails d'un poste spécifique. Les informations à mettre à jour doivent être envoyées dans le corps de la requête.
- 
#### Supprimer un Poste (`/postes/:idPoste`)
- **Route**: `DELETE /postes/:idPoste`
- **Paramètres URL**:
  - `idPoste`: Identifiant unique du poste.
- **Exemple**: `DELETE /postes/:idPoste` permet de supprimer un poste spécifique.

### 14. Events (`/events`)
Gestion des events pour le festival, y compris l'ajout, la récupération et la mise à jour des informations des events.

#### Ajouter un Events (`/events`)
- **Route**: `POST /events`
- **Corps de la requête**:
  - `dateEvent`: Date de l'event.
  - `address`: Adresse de l'event.
  - `duration`: Durée de l'event
  - `city`: Ville de l'event.
  - `postalCode`: Code postal de l'event.
  - `country`: Pays de l'event.
  - `description`: Description de l'event.
  - `idManager`: Identifiant du manager.
- **Exemple**: `POST /events` avec le corps de la requête contenant `{"dateEvent": "2024-06-10T08:00:00", "address": "1 rue de la paix", "duration": 4, "city": "Montpellier", "postalCode": 34000, "country": "France", "description": "Description de l'event", "idManager": 1}` pour créer un nouvel event.

#### Obtenir un Events par ID (`/events/:idEvent`)
- **Exemple**: `GET /events/:idEvent` permet de récupérer les détails d'un event à l'aide de son ID.

#### Obtenir tous les événements (`/events`)
- **Exemple**: `GET /events` permet de récupérer tous les évents.


#### Mettre à jour un Event (`/events/:idEvent`)
- **Route**: `PUT /events/:idEvent`
- **Paramètres URL**:
  - `idEvent`: Identifiant unique de l'event.
- **Corps de la requête**:
  - `dateEvent` (optionnel) : Nouvelle date de l'event.
  - `address` (optionnel) : Nouvelle adresse de l'event.
  - `duration` (optionnel) : Nouvelle durée de l'event.
  - `city` (optionnel) : Nouvelle ville de l'event.
  - `postalCode` (optionnel) : Nouveau code postal de l'event.
  - `country` (optionnel) : Nouveau pays de l'event.
  - `description` (optionnel) : Nouvelle description de l'event.
  - `idManager` (optionnel) : Nouvel identifiant du manager.
- **Exemple**: `PUT /events/:idEvent` permet de mettre à jour les détails d'un event spécifique. Les informations à mettre à jour doivent être envoyées dans le corps de la requête.

#### Supprimer un Event (`/events/:idEvent`)
- **Exemple**: `DELETE /events/:idEvent` permet de supprimer un event spécifique.

### 15. Espace (`/espaces`) pas testé encore

#### Ajouter un Espace (`/espaces`)
- **Route**: `POST /espaces`
- **Corps de la requête**:
  - `name`: Nom de l'espace.
- **Exemple**: `POST /espaces` avec le corps de la requête contenant `{"name": "Espace 1"}` pour créer un nouvel espace.

#### Obtenir un Espace par ID (`/espaces/:idEspace`)
- **Route**: `GET /espaces/:idEspace`
- **Paramètres URL**:
  - `idEspace`: Identifiant unique de l'espace.
- **Exemple**: `GET /espaces/123` pour obtenir les détails de l'espace avec l'ID `123`.

#### Obtenir tous les Espaces (`/espaces`)
- **Route**: `GET /espaces`
- **Paramètres de requête** (query parameters) (optionnels): (pas implémenté encore)
  - `name`: Nom de l'espace.
- **Exemple**: `GET /espaces?name=Espace 1` pour obtenir les détails de l'espace avec le nom `Espace 1`.
- **Exemple**: `GET /espaces` pour obtenir les détails de tous les espaces.

#### Mettre à Jour un Espace (`/espaces/:idEspace`)
- **Route**: `PUT /espaces/:idEspace`
- **Paramètres URL**:
  - `idEspace`: Identifiant unique de l'espace.
- **Corps de la requête**:
    - `name` (optionnel) : Nouveau nom de l'espace.
- **Exemple**: `PUT /espaces/123` avec le corps de la requête pour mettre à jour l'espace `123`.

#### Supprimer un Espace (`/espaces/:idEspace`)
- **Route**: `DELETE /espaces/:idEspace`
- **Paramètres URL**:
  - `idEspace`: Identifiant unique de l'espace.
- **Exemple**: `DELETE /espaces/123` pour supprimer l'espace avec l'ID `123`.

### 16. posteEspaces (`/posteEspaces`) pas testé encore 

#### Ajouter un posteEspace (`/posteEspaces`)
- **Route**: `POST /posteEspaces`
- **Corps de la requête**:
  - `idPoste`: Identifiant du poste.
  - `idEspace`: Identifiant de l'espace.
- **Exemple**: `POST /posteEspaces` avec le corps de la requête contenant `{"idPoste": 1, "idEspace": 1}` pour créer un nouveau posteEspace.

#### Obtenir un posteEspace par ID (`/posteEspaces/:idPoste/:idEspace`)
- **Route**: `GET /posteEspaces/:idPoste/:idEspace`
- **Paramètres URL**:
  - `idPoste`: Identifiant unique du poste.
  - `idEspace`: Identifiant unique de l'espace.
- **Exemple**: `GET /posteEspaces/123/456` pour obtenir les détails du posteEspace avec l'ID `123` et l'ID `456`.

#### Supprimer un posteEspace (`/posteEspaces/:idPoste/:idEspace`)
- **Route**: `DELETE /posteEspaces/:idPoste/:idEspace`
- **Paramètres URL**:
  - `idPoste`: Identifiant unique du poste.
  - `idEspace`: Identifiant unique de l'espace.
- **Exemple**: `DELETE /posteEspaces/123/456` pour supprimer le posteEspace avec l'ID `123` et l'ID `456`.

### 17. Gestion des Référents (`/referents`) pas teste encore

#### Ajouter un Référent (`/referents`)
- **Route**: `POST /referents`
- **Corps de la requête**:
  - `idUser`: Identifiant de l'utilisateur.
  - `idEspace`: Identifiant de l'espace.
  - `jeuxIdGame`: (Optionnel) Identifiant du jeu.
- **Exemple**: `POST /referents` avec le corps de la requête contenant `{"idUser": "user123", "idEspace": 2, "jeuxIdGame": 3}` pour créer un nouveau référent.

#### Obtenir un Référent par ID (`/referents/:idUser/:idEspace`)
- **Route**: `GET /referents/:idUser/:idEspace`
- **Paramètres URL**:
  - `idUser`: Identifiant unique de l'utilisateur.
  - `idEspace`: Identifiant unique de l'espace.
- **Exemple**: `GET /referents/user123/2` pour obtenir les détails du référent avec l'ID utilisateur `user123` et l'ID espace `2`.

#### Mettre à jour un Référent (`/referents/:idUser/:idEspace`)
- **Route**: `PUT /referents/:idUser/:idEspace`
- **Paramètres URL**:
  - `idUser`: Identifiant unique de l'utilisateur.
  - `idEspace`: Identifiant unique de l'espace.
- **Corps de la requête**:
  - `jeuxIdGame`: (Optionnel) Nouvel identifiant du jeu.
- **Exemple**: `PUT /referents/user123/2` avec le corps de la requête contenant `{"jeuxIdGame": 4}` pour mettre à jour le référent.

#### Supprimer un Référent (`/referents/:idUser/:idEspace`)
- **Route**: `DELETE /referents/:idUser/:idEspace`
- **Paramètres URL**:
  - `idUser`: Identifiant unique de l'utilisateur.
  - `idEspace`: Identifiant unique de l'espace.
- **Exemple**: `DELETE /referents/user123/2` pour supprimer le référent avec l'ID utilisateur `user123` et l'ID espace `2`.

### Gestion des CreneauEspaces (`/creneauEspaces`)

#### 18. Ajouter un CreneauEspace (`/creneauEspaces`) pas test
- **Route**: `POST /creneauEspaces`
- **Corps de la requête**:
  - `idCreneau`: Identifiant du créneau.
  - `idEspace`: Identifiant de l'espace.
  - `currentCapacity`: (Optionnel défaut 0) Capacité actuelle de l'espace (nombre).
  - `capacityEspaceAnimationJeux`: (Optionnel défaut 2) Capacité de l'espace pour les animations de jeux (nombre).
- **Exemple**: `POST /creneauEspaces` avec le corps de la requête contenant `{"idCreneau": 1, "idEspace": 1, "capacityEspaceAnimationJeux": 30}` pour créer un nouveau CreneauEspace.

#### Obtenir un CreneauEspace par ID (`/creneauEspaces/:idCreneauEspace`)
- **Route**: `GET /creneauEspaces/:idCreneauEspace`
- **Paramètres URL**:
  - `idCreneauEspace`: Identifiant unique du CreneauEspace.
- **Exemple**: `GET /creneauEspaces/1` pour obtenir les détails du CreneauEspace avec l'ID `1`.

#### Obtenir tous les CreneauEspaces (`/creneauEspaces`)
- **Route**: `GET /creneauEspaces`
- **Exemple**: `GET /creneauEspaces` pour obtenir la liste de tous les CreneauEspaces.

#### Mettre à jour un CreneauEspace (`/creneauEspaces/:idCreneauEspace`)
- **Route**: `PUT /creneauEspaces/:idCreneauEspace`
- **Paramètres URL**:
  - `idCreneauEspace`: Identifiant unique du CreneauEspace.
- **Corps de la requête**:
    - `capacityEspace`: (Optionnel) Nouvelle capacité de l'espace.
    - `capacityEspaceAnimationJeux`: (Optionnel) Nouvelle capacité de l'espace pour les animations de jeux.
- **Exemple**: `PUT /creneauEspaces/1` avec le corps de la requête contenant `{"capacityEspaceAnimationJeux": 50}` pour mettre à jour la capacité de l'espace.

#### Supprimer un CreneauEspace (`/creneauEspaces/:idCreneauEspace`)
- **Route**: `DELETE /creneauEspaces/:idCreneauEspace`
- **Paramètres URL**:
  - `idCreneauEspace`: Identifiant unique du CreneauEspace.
- **Exemple**: `DELETE /creneauEspaces/1` pour supprimer le CreneauEspace avec l'ID `1`.

### 19. Gestion des Inscriptions (`/inscriptions`)

#### Ajouter une Inscription (`/inscriptions`)
- **Route**: `POST /inscriptions`
- **Corps de la requête**:
  - `idUser`: Identifiant de l'utilisateur.
  - `idCreneauEspace`: Identifiant du créneau espace.
  - `isAccepted`: Statut d'acceptation (booléen).
  - `isFlexible`: Flexibilité de l'inscription (booléen).
  - `jeuxIdGame`: (Optionnel) Identifiant du jeu.
- **Exemple**: `POST /inscriptions` avec le corps de la requête contenant `{"idUser": "user123", "idCreneauEspace": 1, "isAccepted": true, "isFlexible": false}` pour créer une nouvelle inscription.

#### Obtenir une Inscription par ID (`/inscriptions/:idUser/:idCreneauEspace`)
- **Route**: `GET /inscriptions/:idUser/:idCreneauEspace`
- **Paramètres URL**:
  - `idUser`: Identifiant unique de l'utilisateur.
  - `idCreneauEspace`: Identifiant unique du créneau espace.
- **Exemple**: `GET /inscriptions/user123/1` pour obtenir les détails de l'inscription avec l'identifiant utilisateur `user123` et l'identifiant créneau espace `1`.

#### Obtenir toutes les Inscriptions d'un user a un festival (`/inscriptions/:idUser/:idFestival`)
- **Route**: `GET /inscriptions/:idUser/:idFestival`
- **Paramètres URL**:
  - `idUser`: Identifiant unique de l'utilisateur.
  - `idFestival`: Identifiant unique du festival.
- **Exemple**: `GET /inscriptions/user123/1` pour obtenir les détails de l'inscription avec l'identifiant utilisateur `user123` et l'identifiant créneau espace `1`.

#### Mettre à jour une Inscription (`/inscriptions/:idUser/:idCreneauEspace`)
- **Route**: `PUT /inscriptions/:idUser/:idCreneauEspace`
- **Paramètres URL**:
  - `idUser`: Identifiant unique de l'utilisateur.
  - `idCreneauEspace`: Identifiant unique du créneau espace.
- **Corps de la requête**:
  - `isAccepted`: (Optionnel) Nouveau statut d'acceptation.
  - `isFlexible`: (Optionnel) Nouvelle flexibilité de l'inscription.
  - `jeuxIdGame`: (Optionnel) Identifiant du jeu.
- **Exemple**: `PUT /inscriptions/user123/1` avec le corps de la requête contenant `{"isAccepted": false}` pour mettre à jour l'inscription.

#### Supprimer une Inscription (`/inscriptions/:idUser/:idCreneauEspace`)
- **Route**: `DELETE /inscriptions/:idUser/:idCreneauEspace`
- **Paramètres URL**:
  - `idUser`: Identifiant unique de l'utilisateur.
  - `idCreneauEspace`: Identifiant unique du créneau espace.
- **Exemple**: `DELETE /inscriptions/user123/1` pour supprimer l'inscription avec l'identifiant utilisateur `user123` et l'identifiant créneau espace `1`.

### 20. Gestion de la Présence (`/isPresent`)

#### Ajouter une Présence (`/isPresent`)
- **Route**: `POST /isPresent`
- **Corps de la requête**:
  - `idFestival`: Identifiant du festival.
  - `idUser`: Identifiant de l'utilisateur.
  - `date`: Date de la présence (format: `YYYY-MM-DD`).
  - `jeuxIdGame`: (Optionnel) Identifiant du jeu.
- **Exemple**: `POST /isPresent` avec le corps de la requête contenant `{"idFestival": 1, "idUser": "user123", "date": "2023-07-21"}` pour enregistrer une présence.

#### Obtenir une Présence par ID (`/isPresent/:idFestival/:idUser/:date`)
- **Route**: `GET /isPresent/:idFestival/:idUser/:date`
- **Paramètres URL**:
  - `idFestival`: Identifiant unique du festival.
  - `idUser`: Identifiant unique de l'utilisateur.
  - `date`: Date de la présence (format: `YYYY-MM-DD`).
- **Exemple**: `GET /isPresent/1/user123/2023-07-21` pour obtenir les détails de la présence.

#### Mettre à jour une Présence (`/isPresent/:idFestival/:idUser/:date`)
- **Route**: `PUT /isPresent/:idFestival/:idUser/:date`
- **Paramètres URL**:
  - `idFestival`: Identifiant unique du festival.
  - `idUser`: Identifiant unique de l'utilisateur.
  - `date`: Date de la présence (format: `YYYY-MM-DD`).
- **Corps de la requête**:
  - `jeuxIdGame`: (Optionnel) Nouvel identifiant du jeu.
- **Exemple**: `PUT /isPresent/1/user123/2023-07-21` avec le corps de la requête pour mettre à jour la présence.

#### Supprimer une Présence (`/isPresent/:idFestival/:idUser/:date`)
- **Route**: `DELETE /isPresent/:idFestival/:idUser/:date`
- **Paramètres URL**:
  - `idFestival`: Identifiant unique du festival.
  - `idUser`: Identifiant unique de l'utilisateur.
  - `date`: Date de la présence (format: `YYYY-MM-DD`).
- **Exemple**: `DELETE /isPresent/1/user123/2023-07-21` pour supprimer la présence enregistrée.

### 21. Gestion des Présentations (`/isPresented`)

#### Ajouter une Présentation (`/isPresented`)
- **Route**: `POST /isPresented`
- **Corps de la requête**:
  - `idGame`: Identifiant du jeu.
  - `idEvent`: Identifiant de l'événement.
- **Exemple**: `POST /isPresented` avec le corps de la requête contenant `{"idGame": 1, "idEvent": 2}` pour enregistrer une nouvelle présentation.

#### Obtenir une Présentation par ID (`/isPresented/:idGame/:idEvent`)
- **Route**: `GET /isPresented/:idGame/:idEvent`
- **Paramètres URL**:
  - `idGame`: Identifiant unique du jeu.
  - `idEvent`: Identifiant unique de l'événement.
- **Exemple**: `GET /isPresented/1/2` pour obtenir les détails de la présentation.

#### Mettre à jour une Présentation (`/isPresented/:idGame/:idEvent`)
- **Route**: `PUT /isPresented/:idGame/:idEvent`
- **Paramètres URL**:
  - `idGame`: Identifiant unique du jeu.
  - `idEvent`: Identifiant unique de l'événement.
- **Corps de la requête**:
  - `newIdGame`: (Optionnel) Nouvel identifiant du jeu.
  - `newIdEvent`: (Optionnel) Nouvel identifiant de l'événement.
- **Exemple**: `PUT /isPresented/1/2` avec le corps de la requête pour mettre à jour la présentation.

#### Supprimer une Présentation (`/isPresented/:idGame/:idEvent`)
- **Route**: `DELETE /isPresented/:idGame/:idEvent`
- **Paramètres URL**:
  - `idGame`: Identifiant unique du jeu.
  - `idEvent`: Identifiant unique de l'événement.
- **Exemple**: `DELETE /isPresented/1/2` pour supprimer la présentation enregistrée.

### 22. Gestion des Jeux Joués (`/isPlay`) 

#### Ajouter un Jeu Joué à un Festival (`/isPlay`)
- **Route**: `POST /isPlay`
- **Corps de la requête**:
  - `idGame`: Identifiant du jeu.
  - `idFestival`: Identifiant du festival.
- **Exemple**: `POST /isPlay` avec le corps de la requête contenant `{"idGame": 1, "idFestival": 2}` pour enregistrer un jeu joué dans un festival.

#### Obtenir un Jeu Joué par ID (`/isPlay/:idGame/:idFestival`)
- **Route**: `GET /isPlay/:idGame/:idFestival`
- **Paramètres URL**:
  - `idGame`: Identifiant unique du jeu.
  - `idFestival`: Identifiant unique du festival.
- **Exemple**: `GET /isPlay/1/2` pour obtenir les détails d'un jeu joué dans un festival.

#### Supprimer un Jeu Joué (`/isPlay/:idGame/:idFestival`)
- **Route**: `DELETE /isPlay/:idGame/:idFestival`
- **Paramètres URL**:
  - `idGame`: Identifiant unique du jeu.
  - `idFestival`: Identifiant unique du festival.
- **Exemple**: `DELETE /isPlay/1/2` pour supprimer un jeu joué dans un festival.


## 📁 Structure du Projet

## 🛡️ Middlewares
- `isAccountOwner`
- `isAuthenticated`
- `isEmailVerified`

## ⚙️ Configuration (`.env` file)
```
JWT_SECRET=""
DATABASE_URL=''
GOOGLE_CLIENT_ID=''
GOOGLE_REDIRECT_URI='http://localhost:8080/auth/google/callback'
GOOGLE_CLIENT_SECRET=''

FRONTEND_URL='http://localhost:8080'
GMAIL_USER='gamefest.mtp@gmail.com'
GMAIL_PASSWORD=''
NODE_ENV='development'
```




## 🛠️ Technologies Utilisées
- NodeJs
- Express
- Prisma
- Typescript
- Jest
- Nodemailer
- Bcrypt
- handlebars

## 🌐 Fournisseur d'Authentification
- Google

## 🧪 Tests des routes
Une base de données de test est créée pour les tests. 
Cette base de donnée est crée via docker.
Il suffit de lancer la commande suivante pour créer et lancer la base de donnée de test :
```
docker-compose up -d
```
Il faut aussi créer un fichier `.env.test` avec les informations suivantes :
DATABASE_URL='mysql://prisma:prisma@localhost:3306/tests'
ect... (voir le fichier .env)

Les tests sont éffectués avec Jest. Exécutez avec :
```
npm test
```

## 🔒 Sécurité
- Utilisation de JWT
- Blocage des requêtes non authentifiées
- Blocage de compte après plusieurs tentatives de connexion échouées
- Vérification de l'email
- Limitation du nombre de requêtes pour prévenir les attaques DDoS

## 📊 Gestion des Logs
L'application possède une gestion des logs enregistrés dans le dossier `logs`. Les logs sont enregistrés dans un fichier par jour.
Si l'application est herbégée sur un service serverless, les logs sont envoyés sur la console.
Il faut donc importer le logger via le fichier loggers.vercel et non logger.file.
