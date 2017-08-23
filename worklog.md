# Work Log

## 2017-08-23 (code)
Fin du développement de la deuxième version (améliorée) du code du programme de réponse mail automatique hors les heures de travail.
- Tests appliqués et réussis :
    - Exclusion des conversations Gmail (avec de nouveau message) au-delà des dernières 10 minutes
    - Exclusions des messages envoyés depuis des adresses avec les alias `MAILER-DAEMON@*` et `postmaster@*`
    - Exclusion des messages en provenance des adresses emails de MyCompany (domaine principal + tous les domaines alias)
    - Exclusion des accusés de lecture
    - Exclusion des messages avec des destinations anonymes (`undisclosed-recipients`)
    - Exclusion des messages déjà traités (i.e. journalisés sur le fichier `Autorespond-log`)

## 2017-08-22
Correction et amélioration du code du script de réponse mail automatique :
- Résolu : Interprétation comme expression régulière des chaînes de caractères extraites des fichiers de configuration.
- Tests, adaptations et corrections.

## 2017-08-19
Continuation du développement et de l’analyse du code source de l’auto-répondeur mail.
Problèmes en cours de traitement :
- Le contenu extrait des cellules de la feuille `From_regex_blacklist` du document « Google Spreadsheet » `Autorespond-config`, par la fonction `MatchesRegex()` ne semble pas être correctement interprété comme étant une expression régulière contre laquelle l’expéditeur devrait être vérifié afin d’exclure les adresses email de MyCompany ainsi que les adresses emails d’administrateur système réservées `postmaster@...` et `mailer-daemon@...`.
- La fonction `ContainsString()` appliquée sur le code source de l’email ne détecte pas la présence des expressions `report-type=disposition-notification` et `report-type=delivery-status` ce qui permettrait l’exclusion des accusés de lecture et des rapports de remise.

## 2017-08-18 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/de409cff65ad04844a45fc67e21cc4371d0bb9c7/Code.js)
Continuation de développement du script « Google Apps Script » de réponse mail automatique :
- Définitions complètes des fonctions d’extractions et de vérification de valeurs depuis des documents « Google Spreadsheet » (configurations et journaux « Logs »).
- Test et débogage  du code.

![2017-08-18 - Gmail-AutoResponder](/assets/2017-08-18%20-%20Gmail-AutoResponder.png)

## 2017-08-17 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/7b38eeb9cf3d04cd02d41b10599a1f3b11bb6a75/Code.js)
Optimisation du code du script « Google Apps Script » de réponse email automatique hors les heures de travail:
- Améliorations apportées ou en cours de développement :
    - Lecture de configurations depuis un document « Google Spreadsheets » (« Autorespond-config »),
    - Enregistrement (journalisation) et vérification des informations identifiant les messages traités dans/depuis un document « Google Spreadsheets » (« Autorespond-log »),
    - Définition de fonctions génériques pour vérifier les données des en-têtes des messages contre les données extraites des fichiers précités,
    - Récupération du message de réponse automatique (corps HTML) depuis un emplacement sécurisé sur l’espace d’hébergement web fourni par « ADK-Media »,
    - Utilisation d’une combinaison de configurations pour filtrer les messages à traiter,
- Une dernière version (draft) du code source est en pièce jointe (fichier « code.txt »).

## 2017-08-11
Continuation du développement du script de réponse mail automatique hors les heures de travail.
Test et évaluation de la lecture et écriture de données sur des fichiers en ligne « Google Spreadsheet », pour la journalisation des opérations et la lecture de configurations.

## 2017-08-09
Continuation du développement du script de réponse mail automatique hors les heures de travail.
Améliorations du code : Premiers essais et évaluation d’une journalisation des opérations vers des fichiers « Google Spreadsheet » hébergés sous « Google Drive ».

## 2017-08-08
Continuation du développement du script de réponse mail automatique hors les heures de travail.
La solution finalement retenue et implémentée pour le stockage et l’importation du contenu du corps du message de réponse automatique et l’hébergement d’un fichier HTML sur notre espace web, sous un répertoire protégé par nom d’utilisateur et mot de passe. Tests et validation.

## 2017-08-07
Continuation du développement du script de réponse mail automatique hors les heures de travail.
**_Problématique_** : Inclusion d’un texte unique dans le corps du message de réponse sans aucune mention d’informations de contact  au format texte . La solution envisagée et d’inclure un tableau de contacts sous format « Image » dans le corps du message.
Améliorations étudiées :
- Inclusion du corps du message au format HTML depuis un fichier externe :
    - Cas d’un fichier texte au format HTML stocké sur « Google Drive ». **Difficulté** : Aucune procédure simple et fonctionnelle n’a été trouvée pour lire le contenu brut d’un fichier texte stcocké sur « Google Drive ».
    - Cas d’un document « Google Docs » exporté au format HTML. **Difficulté** : Il était possible de récupérer le contenu d’un document « Google Docs » sous forme de code HTML et l’insérer dans le corps du message de réponse, mais l’image est par défaut bloquée par la plupart des clients de messagerie modernes puisqu’elle est hébergée en externe .
    - Cas d’un fichier texte au format HTML récupéré via un URL : Un fichier contenant le contenu du corps du message au format HTML a été stocké sur notre espace d’hébergement web, et récupéré via l’URL « http://mycompany.com/email_body.html » . L’image présentant le tableau des contacts y a été codée en Base64 . **Difficulté** : Le corps du message généré dépasse ainsi la taille maximale autorisée sur « Google Apps Script ».

## 2017-08-02
Optimisation du code source du script de réponse automatique qui sera associé à la boîte email operations@mycompany.com :
- Exclusion des messages (souvent spam) dont la destination est anonyme (« undisclosed-recipients »)
- Exclusion des messages automatiques envoyés depuis des administrateurs de serveurs de messagerie (mailer-daemon, postmaster)
- Exclusion des accusés de lecture et des rapports de remise.

## 2017-08-01
Coordination avec l’équipe des opérations et discussions à propos de la meilleure stratégie à adopter pour la programmation des messages de réponse automatique envisagée hors les heures de travail.

## 2017-07-29
- Véirication des résultats de la première exécution du script de réponse automatique programmée entre 06:00GMT et 20:00GMT.
- **Idées pour amélioration:**
    - Exclusion des accusés de lecture. Il va falloir interpréter en-avale les en-têtes dans le code source de chaque email traité afin de vérifier si le contenu [MIME](https://en.wikipedia.org/wiki/MIME#Report) `multipart/report` est de type : `report-type=disposition-notification`.
    - Précautions pour assurer une exécution continue du programme jusqu’à la fin de la plage horaire prédéfinie. Cela dépend de plusieurs facteurs :
        - Le temps d’exécution maximal autorisé durant une journée (24h). Les références en ligne à ce sujet ([documentation Google officielle](https://developers.google.com/apps-script/guides/services/quotas#current_limitations) comprise) laissent des ambiguïtés : ce serait entre [1h](https://webapps.stackexchange.com/a/90089) et [6h](https://developers.google.com/apps-script/guides/services/quotas#current_quotas). Par conséquent, l’intervalle de temps entre chaque exécution du script doit être convenablement choisi selon le temps moyen nécessaire pour le traitement des derniers messages reçus sur le compte mail.
        - Le fuseau horaire et l’heure d’été. Afin d’éviter toute confusion, [Google utilise à la base l’heure UTC sur ses plateformes et services](https://support.google.com/calendar/answer/37064?hl=en), y compris « Google Apps Script ». Par conséquent, et suite aux changements de l’heure locale, il serait difficile d’inclure des référence horaires dynamiques dans le code source du script ou bien de les modifier manuellement à chaque changement. A concevoir donc, éventuellement, une solution pour adapter automatiquement la plage horaire. En attendant, une plage horaire plus inclusive ; 6h-19h (GMT), soit 7h-20h (GMT+1), sera utilisée.
        - Voir la possibilité de vérifier l’authenticité des expéditeurs (signatures des e-mails…)
        - Externaliser les filtres et les contenus personnalisés pour une meilleure portabilité du code.

## 2017-07-28 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/b78bde10064fd74e9e1279eb01b5e662f196a04f/Code.js)
Continuation de l’étude et développement du script « Google Apps Script » pour l’envoie des réponses automatiques aux messages reçus dans des plages horaires spécifiques:
- Fin de développement de la première version du script.
- Première exécution (automatique) de test pour la boîte email « operations@mycompany.com » prévue entre 28/07/2017, 20:00GMT et 29/07/2017 06:00GMT.

![2017-07-28 - Gmail-Autoresponder](/assets/2017-07-28%20-%20Gmail-Autoresponder.png)

## 2017-07-27 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/640a75ff3bfc40c81f542dca60bc39c1ca9753c5/Code.js)
Continuation de l’étude et développement du script « Google Apps Script » pour l’envoie de réponses automatiques aux messages reçus dans des plages horaires spécifiques.
- **Spécifications et cahier de charges** :
    - Le script sera configuré pour exécution automatique régulière entre 20h et 6h sur chaque compte utilisateur Google .
    - Il vérifiera les derniers messages reçu. Puisque les messages sont interprétés comme des groupes de discussion par « Gmail », les discussions avec de nouveaux messages (réponses ou transferts) seront inclues.
    - Les messages en provenance des contacts de MyCompany seront exclus.
    - Option : Les messages/discussions avec le libellé Gmail « _autoRep » seront considérés comme étant déjà traités et seront donc systématiquement exclus. (voir le dernier point).
    - Traitement des messages : Envoie de corp de la réponse automatique sous forme de texte riche (HTML) suivie des informations (date, expéditeur, destinataires, objet) et une citation du contenu du message traité.
    - Attribution du libellé Gmail « _autoRep » pour marquer le message comme traité.

## 2017-07-26 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/52cb442af57432b3a2a4068077d0438806896a43/Code.js)
Etude de faisabilité et début de développement d’un premier prototype d’un script permettant l’envoie de réponses automatiques aux messages reçus dans des plages horaires spécifiques.

![2017-07-26 - Gmail-AutoResponder](assets/2017-07-26%20-%20Gmail-AutoResponder.png)
