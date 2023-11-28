liste de route de l'api :
/auth/:provider
/auth/:provider/callback
/login
/register
/currentUser'
/verify-email

Liste midleware :
- isAccountOwner
- isAuthenticated
- isEmailVerified


Liste provider :
-Google

Securité mise en place :
- JWT
- Blocage des requetes non authentifié
- Blocage compte apres x tentatives de connexion
- Verification de l'email

L'application possede une gestion des logs qui sont enregistrés dans le dossier logs.
Les logs sont enregistrés dans un fichier par jour.