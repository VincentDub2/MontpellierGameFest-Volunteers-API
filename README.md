# 🎉 Application de Gestion des Utilisateurs pour le Festival du Jeu à Montpellier

## 📜 Contexte
Cette application web est conçue pour le cadre universitaire et destinée à la gestion des bénévoles pour le festival du jeu à Montpellier.

## ✨ Fonctionnalités
- Gestion des utilisateurs
- Authentification et enregistrement
- Gestion des bénévoles

## 🚀 Routes de l'API
- \`/auth/:provider\`
- \`/auth/:provider/callback\`
- \`/login\`
- \`/register\`
- \`/currentUser\`
- \`/verify-email\`

### Détails des Routes de l'API

#### 1. Authentification avec un Fournisseur (\`/auth/:provider\`)
Cette route permet à un utilisateur de s'authentifier via un fournisseur externe (par exemple, Google).
- **Exemple**: \`GET /auth/google\` pour démarrer le processus d'authentification avec Google.

#### 2. Callback d'Authentification (\`/auth/:provider/callback\`)
Après l'authentification avec le fournisseur, cette route gère la réponse et les données de l'utilisateur.
- **Exemple**: \`GET /auth/google/callback\` reçoit les données de l'utilisateur de Google et termine le processus d'authentification.

#### 3. Connexion (\`/login\`)
Permet à un utilisateur de se connecter en utilisant ses identifiants de l'application.
- **Exemple**: \`POST /login\` avec le corps de la requête contenant le nom d'utilisateur et le mot de passe.

#### 4. Enregistrement (\`/register\`)
Permet à un nouvel utilisateur de créer un compte.
- **Exemple**: \`POST /register\` avec les informations nécessaires à l'enregistrement (e-mail, nom d'utilisateur, mot de passe).

#### 5. Utilisateur Actuel (\`/currentUser\`)
Récupère les informations de l'utilisateur actuellement connecté.
- **Exemple**: \`GET /currentUser\` renvoie les détails de l'utilisateur connecté.

#### 6. Vérification de l'E-mail (\`/verify-email\`)
Permet à l'utilisateur de vérifier son adresse e-mail.
- **Exemple**: \`POST /verify-email\` avec un token envoyé à l'adresse e-mail de l'utilisateur pour confirmer son identité.

## 🛡️ Middlewares
- \`isAccountOwner\`
- \`isAuthenticated\`
- \`isEmailVerified\`

## ⚙️ Configuration (\`.env\` file)
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
L'application possède une gestion des logs enregistrés dans le dossier \`logs\`. Les logs sont enregistrés dans un fichier par jour.
