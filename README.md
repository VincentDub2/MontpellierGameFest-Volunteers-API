# 🎉 Application de Gestion des Utilisateurs pour le Festival du Jeu à Montpellier

## 📜 Contexte
Cette application web est conçue pour le cadre universitaire et destinée à la gestion des bénévoles pour le festival du jeu à Montpellier.

## ✨ Fonctionnalités
- Gestion des utilisateurs
- Authentification et enregistrement
- Gestion des bénévoles

## 🚀 Routes de l'API
- `/auth/:provider\`
- `/auth/:provider/callback`
- `/login`
- `/register`
- `/currentUser`
- `/verify-email`
- `/reset-password`
- `/update-password-with-token`
- `/uploadCsv`
- `/games`
- `/game/:id`
- `/festivals`
- `/festival`
- `/festival/:id`
- `/festivalCurrent`
- `/festivalNext`
- `/updateUserPicture`

### Détails des Routes de l'API

#### 1. Authentification avec un Fournisseur (`/auth/:provider`)
Cette route permet à un utilisateur de s'authentifier via un fournisseur externe (par exemple, Google).
- **Exemple**: `GET /auth/google` pour démarrer le processus d'authentification avec Google.

#### 2. Callback d'Authentification (`/auth/:provider/callback`)
Après l'authentification avec le fournisseur, cette route gère la réponse et les données de l'utilisateur.
- **Exemple**: `GET /auth/google/callback` reçoit les données de l'utilisateur de Google et termine le processus d'authentification.

#### 3. Connexion (`/login`)
Permet à un utilisateur de se connecter en utilisant ses identifiants de l'application.
- **Exemple**: `POST /login` avec le corps de la requête contenant le nom d'utilisateur et le mot de passe.

#### 4. Enregistrement (`/register`)
Permet à un nouvel utilisateur de créer un compte.
- **Exemple**: `POST /register` avec les informations nécessaires à l'enregistrement (e-mail, nom d'utilisateur, mot de passe).
- Possibilité de fournir une photo de profil en utilisant le champ `picture` du corps de la requête.

#### 5. Utilisateur Actuel (`/currentUser`)
Récupère les informations de l'utilisateur actuellement connecté.
- **Exemple**: `GET /currentUser` renvoie les détails de l'utilisateur connecté.

#### 6. Vérification de l'E-mail (`/verify-email`)
Permet à l'utilisateur de vérifier son adresse e-mail.
- **Exemple**: `POST /verify-email` avec un token envoyé à l'adresse e-mail de l'utilisateur pour confirmer son identité.

#### 7. Réinitialisation du Mot de Passe (`/reset-password`)
Permet à l'utilisateur de réinitialiser son mot de passe.
- **Exemple**: `POST /reset-password` avec l'adresse e-mail de l'utilisateur pour recevoir un lien de réinitialisation du mot de passe.
- **Exemple**: `POST /update-password-with-token` avec le token envoyé à l'adresse e-mail de l'utilisateur pour réinitialiser son mot de passe.

#### 8. Importation d'un Fichier CSV (`/uploadCsv`)
Permet d'importer un fichier CSV contenant les informations des bénévoles.
Ps : le fichier CSV doit être envoyé dans le corps de la requête avec le nome 'file'.
Note : Utilisation de la librairie 'csv-parser' pour parser le fichier CSV.
Les requetes sont effectuées en parallel pour optimiser le delai.
- **Exemple**: `POST /uploadCsv` avec un fichier CSV contenant les informations des bénévoles.

### 9. Jeux (`/games`)
Permet de récupérer la liste des jeux.
- **Exemple**: `GET /games` renvoie la liste des jeux.
- **Exemple**: `GET /games?name=monopoly` renvoie la liste des jeux dont le nom contient "monopoly".
- **Exemple**: `GET /games?pageSize=10` renvoie les 10 premiers jeux.
- **Exemple**: `GET /games?page=2` renvoie les jeux de la page 2.
- **Exemple**: `GET /games?page=1&pageSize=20` renvoie les 20 premiers jeux de la page 1.

- **Exemple**: `GET /game/:id` renvoie le jeu avec l'id correspondant.
- **Exemple**: `POST /game` permet d'ajouter un jeu.
- **Exemple**: `PUT /gams/:id` permet de modifier un jeu.
- **Exemple**: `DELETE /game/:id` permet de supprimer un jeu.

### 10 . Festival (`/festival`)
Permet de récupérer les informations du festival.
- **Exemple**: `GET /festivals` renvoie la liste des festivals.
- **Exemple**: `GET /festival` renvoie le dernier festival crée.
- **Exemple**: `GET /festival/:id` renvoie le festival avec l'id correspondant.
- **Exemple**: `POST /festival` permet d'ajouter un festival.
- **Exemple**: `PUT /festival/:id` permet de modifier un festival.
- **Exemple**: `DELETE /festival/:id` permet de supprimer un festival.
- **Exemple**: `GET /festivalCurrent` renvoie le festival en cours.
- **Exemple**: `GET /festivalNext` renvoie le festival suivant.

### 11 . User (`/updateUserPicture`)
Permet de modifier la photo de profil de l'utilisateur.
- **Exemple**: `POST /updateUserPicture` permet de modifier la photo de profil de l'utilisateur.

### 12 . Association (`/association`)
- **Exemple**: `GET /associations` renvoie la liste des associations.
- **Exemple**: `GET /associations?name=runningClub` renvoie la liste des associations dont le nom contient "runningClub".
- **Exemple**: `GET /associations?pageSize=10` renvoie les 10 premières associations.
- **Exemple**: `GET /associations?page=2` renvoie les associations de la page 2.
- **Exemple**: `GET /associations?page=1&pageSize=20` renvoie les 20 premières associations de la page 1.

- **Exemple**: `GET /association/:id` renvoie l'association avec l'id correspondant.
- **Exemple**: `POST /association` permet d'ajouter une association.
- **Exemple**: `PUT /association/:id` permet de modifier une association.
- **Exemple**: `DELETE /association/:id` permet de supprimer une association.

- **Exemple**: `POST /association/:associationId/user/:userId` permet d'ajouter un utilisateur à une association.
- **Exemple**: `GET /user/:userId/associations` permet de récupérer les associations d'un utilisateur.
- **Exemple**: `GET /association/:associationId/users` permet de récupérer les utilisateurs d'une association.
- **Exemple**: `DELETE /association/:associationId/user/:userId` permet de supprimer un utilisateur d'une association.

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

## 🧪 Tests Unitaires
Effectués avec Jest. Exécutez avec :
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
