# Work Log

## 2017-07-26 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/52cb442af57432b3a2a4068077d0438806896a43/Code.js)
Etude de faisabilité et début de développement d’un premier prototype d’un script permettant l’envoie de réponses automatiques aux messages reçus dans des plages horaires spécifiques.

![2017-07-26 - Gmail-AutoResponder](assets/2017-07-26%20-%20Gmail-AutoResponder.png)

## 2017-07-27 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/640a75ff3bfc40c81f542dca60bc39c1ca9753c5/Code.js)
Continuation de l’étude et développement du script « Google Apps Script » pour l’envoie de réponses automatiques aux messages reçus dans des plages horaires spécifiques.
- **Spécifications et cahier de charges** :
    - Le script sera configuré pour exécution automatique régulière entre 20h et 6h sur chaque compte utilisateur Google .
    - Il vérifiera les derniers messages reçu. Puisque les messages sont interprétés comme des groupes de discussion par « Gmail », les discussions avec de nouveaux messages (réponses ou transferts) seront inclues.
    - Les messages en provenance des contacts de MyCompany seront exclus.
    - Option : Les messages/discussions avec le libellé Gmail « _autoRep » seront considérés comme étant déjà traités et seront donc systématiquement exclus. (voir le dernier point).
    - Traitement des messages : Envoie de corp de la réponse automatique sous forme de texte riche (HTML) suivie des informations (date, expéditeur, destinataires, objet) et une citation du contenu du message traité.
    - Attribution du libellé Gmail « _autoRep » pour marquer le message comme traité.

## 2017-07-28 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/b78bde10064fd74e9e1279eb01b5e662f196a04f/Code.js)
Continuation de l’étude et développement du script « Google Apps Script » pour l’envoie des réponses automatiques aux messages reçus dans des plages horaires spécifiques:
- Fin de développement de la première version du script.
- Première exécution (automatique) de test pour la boîte email « operations@mycompany.com » prévue entre 28/07/2017, 20:00GMT et 29/07/2017 06:00GMT.

![2017-07-28 - Gmail-Autoresponder](assets/2017-07-28%20-%20Gmail-Autoresponder.png)

## 2017-07-29
- Véirication des résultats de la première exécution du script de réponse automatique programmée entre 06:00GMT et 20:00GMT.
- **Idées pour amélioration:**
    - Exclusion des accusés de lecture. Il va falloir interpréter en-avale les en-têtes dans le code source de chaque email traité afin de vérifier si le contenu [MIME](https://en.wikipedia.org/wiki/MIME#Report) `multipart/report` est de type : `report-type=disposition-notification`.
    - Précautions pour assurer une exécution continue du programme jusqu’à la fin de la plage horaire prédéfinie. Cela dépend de plusieurs facteurs :
        - Le temps d’exécution maximal autorisé durant une journée (24h). Les références en ligne à ce sujet ([documentation Google officielle](https://developers.google.com/apps-script/guides/services/quotas#current_limitations) comprise) laissent des ambiguïtés : ce serait entre [1h](https://webapps.stackexchange.com/a/90089) et [6h](https://developers.google.com/apps-script/guides/services/quotas#current_quotas). Par conséquent, l’intervalle de temps entre chaque exécution du script doit être convenablement choisi selon le temps moyen nécessaire pour le traitement des derniers messages reçus sur le compte mail.
        - Le fuseau horaire et l’heure d’été. Afin d’éviter toute confusion, [Google utilise à la base l’heure UTC sur ses plateformes et services](https://support.google.com/calendar/answer/37064?hl=en), y compris « Google Apps Script ». Par conséquent, et suite aux changements de l’heure locale, il serait difficile d’inclure des référence horaires dynamiques dans le code source du script ou bien de les modifier manuellement à chaque changement. A concevoir donc, éventuellement, une solution pour adapter automatiquement la plage horaire. En attendant, une plage horaire plus inclusive ; 6h-19h (GMT), soit 7h-20h (GMT+1), sera utilisée.
        - Voir la possibilité de vérifier l’authenticité des expéditeurs (signatures des e-mails…)
        - Externaliser les filtres et les contenus personnalisés pour une meilleure portabilité du code.

## 2017-08-01
Coordination avec l’équipe des opérations et discussions à propos de la meilleure stratégie à adopter pour la programmation des messages de réponse automatique envisagée hors les heures de travail.

## 2017-08-02
Optimisation du code source du script de réponse automatique qui sera associé à la boîte email operations@mycompany.com :
- Exclusion des messages (souvent spam) dont la destination est anonyme (« undisclosed-recipients »)
- Exclusion des messages automatiques envoyés depuis des administrateurs de serveurs de messagerie (mailer-daemon, postmaster)
- Exclusion des accusés de lecture et des rapports de remise.

## 2017-08-07
Continuation du développement du script de réponse mail automatique hors les heures de travail.
**_Problématique_** : Inclusion d’un texte unique dans le corps du message de réponse sans aucune mention d’informations de contact  au format texte . La solution envisagée et d’inclure un tableau de contacts sous format « Image » dans le corps du message.
Améliorations étudiées :
- Inclusion du corps du message au format HTML depuis un fichier externe :
    - Cas d’un fichier texte au format HTML stocké sur « Google Drive ». **Difficulté** : Aucune procédure simple et fonctionnelle n’a été trouvée pour lire le contenu brut d’un fichier texte stcocké sur « Google Drive ».
    - Cas d’un document « Google Docs » exporté au format HTML. **Difficulté** : Il était possible de récupérer le contenu d’un document « Google Docs » sous forme de code HTML et l’insérer dans le corps du message de réponse, mais l’image est par défaut bloquée par la plupart des clients de messagerie modernes puisqu’elle est hébergée en externe .
    - Cas d’un fichier texte au format HTML récupéré via un URL : Un fichier contenant le contenu du corps du message au format HTML a été stocké sur notre espace d’hébergement web, et récupéré via l’URL « http://mycompany.com/email_body.html » . L’image présentant le tableau des contacts y a été codée en Base64 . **Difficulté** : Le corps du message généré dépasse ainsi la taille maximale autorisée sur « Google Apps Script ».

## 2017-08-08
Continuation du développement du script de réponse mail automatique hors les heures de travail.
La solution finalement retenue et implémentée pour le stockage et l’importation du contenu du corps du message de réponse automatique et l’hébergement d’un fichier HTML sur notre espace web, sous un répertoire protégé par nom d’utilisateur et mot de passe. Tests et validation.

## 2017-08-09
Continuation du développement du script de réponse mail automatique hors les heures de travail.
Améliorations du code : Premiers essais et évaluation d’une journalisation des opérations vers des fichiers « Google Spreadsheet » hébergés sous « Google Drive ».

## 2017-08-11
Continuation du développement du script de réponse mail automatique hors les heures de travail.
Test et évaluation de la lecture et écriture de données sur des fichiers en ligne « Google Spreadsheet », pour la journalisation des opérations et la lecture de configurations.

## 2017-08-17 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/7b38eeb9cf3d04cd02d41b10599a1f3b11bb6a75/Code.js)
Optimisation du code du script « Google Apps Script » de réponse email automatique hors les heures de travail:
- Améliorations apportées ou en cours de développement :
    - Lecture de configurations depuis un document « Google Spreadsheets » (« Autorespond-config »),
    - Enregistrement (journalisation) et vérification des informations identifiant les messages traités dans/depuis un document « Google Spreadsheets » (« Autorespond-log »),
    - Définition de fonctions génériques pour vérifier les données des en-têtes des messages contre les données extraites des fichiers précités,
    - Récupération du message de réponse automatique (corps HTML) depuis un emplacement sécurisé sur l’espace d’hébergement web fourni par « ADK-Media »,
    - Utilisation d’une combinaison de configurations pour filtrer les messages à traiter,
- Une dernière version (draft) du code source est en pièce jointe (fichier « code.txt »).

## 2017-08-18 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/de409cff65ad04844a45fc67e21cc4371d0bb9c7/Code.js)
Continuation de développement du script « Google Apps Script » de réponse mail automatique :
- Définitions complètes des fonctions d’extractions et de vérification de valeurs depuis des documents « Google Spreadsheet » (configurations et journaux « Logs »).
- Test et débogage  du code.

![2017-08-18 - Gmail-AutoResponder](assets/2017-08-18%20-%20Gmail-AutoResponder.png)

## 2017-08-19
Continuation du développement et de l’analyse du code source de l’auto-répondeur mail.
Problèmes en cours de traitement :
- Le contenu extrait des cellules de la feuille `From_regex_blacklist` du document « Google Spreadsheet » `Autorespond-config`, par la fonction `MatchesRegex()` ne semble pas être correctement interprété comme étant une expression régulière contre laquelle l’expéditeur devrait être vérifié afin d’exclure les adresses email de MyCompany ainsi que les adresses emails d’administrateur système réservées `postmaster@...` et `mailer-daemon@...`.
- La fonction `ContainsString()` appliquée sur le code source de l’email ne détecte pas la présence des expressions `report-type=disposition-notification` et `report-type=delivery-status` ce qui permettrait l’exclusion des accusés de lecture et des rapports de remise.

## 2017-08-22
Correction et amélioration du code du script de réponse mail automatique :
- Résolu : Interprétation comme expression régulière des chaînes de caractères extraites des fichiers de configuration.
- Tests, adaptations et corrections.

## 2017-08-23 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/3ca7290fbebeb6a83c92497c2132bf717bc42a4d/Code.js)
Fin du développement de la deuxième version (améliorée) du code du programme de réponse mail automatique hors les heures de travail.
- Tests appliqués et réussis :
    - Exclusion des conversations Gmail (avec de nouveau message) au-delà des dernières 10 minutes
    - Exclusions des messages envoyés depuis des adresses avec les alias `MAILER-DAEMON@*` et `postmaster@*`
    - Exclusion des messages en provenance des adresses emails de MyCompany (domaine principal + tous les domaines alias)
    - Exclusion des accusés de lecture
    - Exclusion des messages avec des destinations anonymes (`undisclosed-recipients`)
    - Exclusion des messages déjà traités (i.e. journalisés sur le fichier `Autorespond-log`)

## 2017-08-24
Bilan de l’exécution du programme de réponse mail automatique pour le compte « operations@mycompany.com » :
- 24 réponses automatiques envoyées entre 21:06 et 06:26 (heure locale).
- La stratégie adoptée par les services et applications Google pour déterminer l’heure exacte des événements (l’heure de réception des messages en l’occurrence) porte plutôt à confusion. Par conséquent, comme Google affirme  qu’elle [utilise l’heure UTC](https://support.google.com/calendar/answer/37064?hl=en) sur ses services en ligne, une plage horaire plus large sera utilisée pour que l’intervalle **20h-06h** (heure locale) soit toujours couvert malgré les éventuels changements (i.e. début, suspension et fin de l’heure d’été). La ligne de code suivante :
    - `if (((hour < 6) || (hour >= 20)) && ((threads = GmailApp.search('is:inbox after:' + timeFrom)).length !== 0)) {` sera donc modifié en :
    - **`if (((hour < 6) || (hour >= 19)) && ((threads = GmailApp.search('is:inbox after:' + timeFrom)).length !== 0)) {`**.
- Confirmation avec l'équipe des Opérations de la liste des contacts à exclure de la réponse automatique.
- Désinscription de quelques newsletters via les liens fournis dans les corps de leurs messages respectifs.
- Modification du message de réponse automatique : l’adresse de modération « amine@mycompany.com » en `Cci` au lieu de `Cc`.
- Groupement des fichiers du programme dans un même dossier sous « Google Drive ». Partage avec le compte Google de « AMINE » (lecture et modification) pour faciliter les consultations et les mises à jour.

## 2017-08-25 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/8db67d4c1b5e18294b05233e5290f9672235f75f/Code.js)
Bilan de l’exécution du programme de réponse mail automatique sur le compte « operations@mycompany.com » pour le 24/08/2017 :
- 17 réponses automatiques envoyées entre 20:28 et 06:35 (heure locale)
- Amélioration du programme :
    - Réorganisation des lignes de déclaration des variables pour une meilleure lisibilité et portabilité du code.
    - Enregistrement des configurations sur une seule feuille du document `Autorespond-config`. Adaptation du code.
- Rajout d’une valeur de décalage pour faciliter l’ajustement de la plage horaire d’exécution en cas de changement de l’heure locale.
- Utilisation d’une adresse générique `no-reply` afin de dissuader les destinataires de répondre directement aux messages automatiques. Par ailleurs, cela nous épargnera de configurer et maintenir sur chaque installation du logiciel Outlook un filtre pour en supprimer les copies reçues.
- Exclusion des adresses email contenant les mots `noreply` et `no-reply`.
- Journalisation de tous les emails, traités et sautés.

## 2017-08-26
Evaluation des performances du programme de réponse mail automatique associé au compte `operations@mycompany.com` durant son exécution entre 25/08/2017 à 20:00 et 26/08/2017 à 06:00 :
- **32/33** des messages reçus dans la plage horaire 20h-06h ont été traités.
    - **1** message non détecté. Il s’agit d’un deuxième accusé de lecture du même message par le même destinataire. Vu que les deux emails font partie de la même conversation (thread) Gmail, seul le plus récent a été traité.
    - **3** réponses automatiques envoyées
    - **29** messages exclus pour des raisons valides
- Vu le résultat assez satisfaisant de son exécution, le code source -en sa dernière version- sera retenu.

## 2017-08-28
Evaluation des performances du programme de réponse mail automatique associé au compte `operations@mycompany.com` durant son exécution du 26/08/2017 au 28/08/2017 :
- **87** messages traités:
    - **16** réponses automatiques envoyées, dont **5** étaient non pertinentes (adresses email à ajouter à la liste d'exclusion)
    - **71** messages sautés pour des raisons valides.
- Améliorations du code :
    - Ajout d’une nouvelle feuille dans le fichier de journalisation `Autorespond-log` pour l’éventuel enregistrement de l’heure d’exécution ainsi que le nombre de conversations (threads) Gmail du dernier intervalle de temps (prédéfini, et après lequel le programme se ré-exécute).
    - Marquage de la fin de session d’exécution globale (20h-06h) sur chacune des feuilles du journal afin d’en faciliter la lecture et l’analyse.
    - Le code source sera publié le 30/08/2017

## 2017-08-29
Confirmation de l’exécution optimale de la session du 28/07/2017 du programme de réponse mail automatique associé au compte Google « operations@mycompany.com » avec les dernières mises à jours du code.
- Améliorations du code :
    - Inclusion du code HTML constituant le corps du message de réponse dans un fichier HTML du même projet « Google Apps Script », au lieu de l’importer depuis un fichier externe hébergé sur un espace d’hébergement web tiers.
    - Rajout d’un fichier de script supplémentaire au même projet et sa programmation pour exécution automatique mensuelle. Le script archivera les opérations (i.e. réponses envoyées, et messages sautés) de chaque mois dans une nouvelle feuille du fichier log Spreadsheet « Autorespond-log » afin d’alléger la feuille principale du journal.
    - Le code source sera publié le 30/08/2017
- Configuration provisoire pour test et validation : le script « Archive_log.gs » a été paramétré pour exécution automatique mensuelle le 30 de chaque mois ; en l’occurrence, une première exécution aurait lieu lendemain 30/08/2017.

## 2017-08-30 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/273cde78e38378e1cdc70fdfd5ee867936f573ac/app)
Confirmation de l’exécution optimale de la session du 29/07/2017 du programme de réponse mail automatique associé au compte Google « operations@mycompany.com ».
Le test d’archivage du journal des messages traités s’est exécuté comme planifié et avec succès. Dorénavant, au début de chaque mois, l’historique des opérations du mois précédent sera archivé dans une feuille séparée du même fichier.
Etude en cours de la possibilité de gérer les réponses automatiques de toutes les boîtes emails de la société avec un seul programme lisant les configurations depuis un même fichier et enregistrant toutes les opérations exécutées dans le même journal. Si cela s’avère faisable, une révision considérable du tout le code source serait nécessaire.

## 2017-08-31
Evaluation de l’exécution de la session du 31/07/2017 du programme de réponse mail automatique.
- 50 mails traités, dont 37 sautés.
- Ajoutée des adresses à la liste d’exclusion
- Un message « SPAM » sans une vraie adresse `envelop sender` ni `From :` a déclenché une erreur, puisque la méthode [`GmailMessage.getFrom()`](https://developers.google.com/apps-script/reference/gmail/gmail-message#getfrom) dans le code a retourné la valeur `Judith Pin  <>` qui n’est pas une adresse valide pour envoyer une réponse avec la méthode [`GmailThread.reply(body, options)`](https://developers.google.com/apps-script/reference/gmail/gmail-thread#replybody-options). Bien que l’erreur n’était pas bloquante et ait été bien reportée par email, il serait plus judicieux de journaliser de tels cas avec le message d’erreur comme note. Cette suggestion peut faire objet d’une future amélioration du code avec des éventuels [traitements d’exceptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch).
- Exécution du programme sur toutes les boîtes emails depuis un même programme central. _Idées et prévisions_:
    - La méthode la plus sûr serait de communiquer, depuis le script « operations », avec d’autres scripts « Google Apps » associés aux autres comptes, en utilisant des requêtes HTTP POST sur des connexions chiffrées (SSL/TLS).
    - Comme prérequis, il va falloir d’abord publier chacun des autres scripts en tant qu’application web (avec d’éventuelles restrictions d’accès pour protéger les données).
    - Les autres scripts auraient les droits suivant :
        - Modification du fichier « Google Spreadsheet » : Autorespond-log, propriété du compte operations@mycompany.com.
        - Lecture du fichier « Google Spreadsheet » : Autorespond-config, propriété du compte operations@mycompany.com.
    - Consultation en cours des documentations ainsi que les forums d’aide et support officiels aux sujets précités.

## 2017-09-05
Évaluation de l’exécution du programme de réponses mail automatique pour le compte de « OPERATIONS » entre le 31/08/2017 (soir) et le 05/09/2017 (matinée):
- 162 threads détectés, dont 114 sautés et 48 réponses envoyées.
- Ajout d'adresse mails à la liste d’exclusion.

## 2017-09-06
Analyse des résultats de la session d’exécution du 05/09/2017 :
- 57 messages traités : 18 réponses envoyées, 39 messages sautés pour des raisons valides.
- Les réponses automatiques envoyées ont couverts tous les « threads » Gmail reçus dans la plage horaire [20h-06h].
- Mises à jour mineures du code source.
- Documentation sur les améliorations envisagées :
    - Utilisation du [Cache](https://developers.google.com/apps-script/reference/cache/) : pour le stockage temporaire et la consultation rapide des identifiants des derniers messages traités , au lieu d’extraire et rechercher dans toutes les valeurs de la colonne D « Message ID » de la première feuille du fichier « Google Spreadsheet » de journalisation « Autorespond-log ».
    - Etude d’une nouvelle architecture « Master/Slave » du programme pour déclencher simultanément les réponses automatiques de plusieurs comptes depuis un même script asynchrone avec des requêtes « HTTP POST ».

## 2017-09-07 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/c2b1040cf1342dff6689a13129b02c971ae9f55d/app)
Analyse des résultats de la session d’exécution du 06/09/2017 :
- Le projet Google Apps Script « AutoRespond » est configuré  avec un déclencheur en fonctions du temps qui se lance après chaque 10 minute. Les heures des premières et dernières exécutions effectives  du programme sont respectivement 19:06 (GMT) et 04:56 (GMT). _En effet, le programme s’exécute continument après chaque 10 minute durant toutes les 24 heures. Cependant le traitement des messages reçus n’est effectué que si la condition est satisfaite, à savoir : être dans la plage horaire [20h-06h]._
- Comme les messages Gmail sont organisés sous forme de « [threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread#) » (conversations), le programme récupère à chaque exécution les nouveaux « threads » ainsi que ceux mis à jour _(c.à.d. réception de nouvelles réponses à une ancienne conversation (échange))_ dans les dernières 10 minutes et traite ensuite leurs derniers messages respectifs.
- Pour chaque « thread », si le dernier message ne répond à aucun critère d’exclusion, une réponse automatique lui serait envoyée ; sinon, le programme passe au « thread » suivant. Dans chacun des deux cas, les messages traités ainsi que le nombre de « threads » récupérés à chaque exécution sont journalisés. Les informations du journal (log) permettent le suivi, l’analyse et le diagnostic des éventuels problèmes rencontrés.
- Deux cas de figures se sont présentés suite à la dernière session d’exécution; qui peuvent nécessiter une analyse du comportement du programme, une évaluation des risques ainsi que des éventuelles améliorations du code source :
    - **MESSAGE (1):** Le message a été reçu vers 21:16 mais n’a pas été traité.
        - Vu qu’il était le dernier message de son « thread » jusqu’à la fin de la session d’exécution, la seule cause apparente serait le fait que sa réception a coïncidé avec le déclenchement du programme et il n’a pas été récupéré parmi les messages reçus dans les dernières 10 minutes.
        - Le message n’a pas été non plus récupéré dans l’itération suivante.
        - Il serait donc plus prudent d’ajouter une marge d’erreur à l’intervalle de temps. Ce serait pratique d’attribuer une valeur dynamique à cet intervalle, soit par exemple **1.5x** la durée séparant deux exécutions (automatique) consécutives du programme.
        - Documentation en cours sur [les moyens disponibles](https://developers.google.com/apps-script/reference/script/trigger) pour éventuellement ce faire.
    - **MESSAGE (2):** Deux minutes après, et dans le même « thread », le message a été suivi par un autre (i.e. une réponse) envoyé par (accounting@mycompany.com) avec l’adresse (operations@mycompany.com) en copie.
        - Vu que le dernier message du « thread » venait d’une adresse mail exclue, il a été sauté.
        - Le présent cas laisse à penser à d’autres cas probables pouvant être critique, comme celui d’un message répondant à tous les critères de réponse automatique suivi juste après, dans le même « thread », d’un mail exclu mais sans qu’il soit envoyé depuis une autre adresse email de « My Company »; cas d’un accusé de lecture d’un ancien message dans le même « thread » reçu du même expéditeur, par exemple.
        - Etude en cours d’améliorations et méthodes alternatives pour traiter avec plus de prudence les files des derniers messages reçus.

## 2017-09-08
Evaluation des résultats de la session d’exécution du **07/09/2017** : **36** messages traités, dont **27** sautées pour des raisons valides et **9** réponses envoyées.

## 2017-09-09 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/4cbad223f9cc08557e861f9770a31eae552a68fa/app)
Analyse des résultats de la session d’exécution du 08/09/2017 :
- **58** messages traités, dont **44** sautées pour des raisons valides et **14** réponses envoyées.
- **2** messages non traités :
    - **MESSAGE (1):** L’heure de réception du message était très proche (en amont) de l’instant de l’itération du programme qui a eu lieu exactement à 19:06 (GMT).
    - **MESSAGE (2):** Le message a été reçu sur la boîte email « operations@OldMailServer.com » et récupéré sur la boîte principale « operations@mycompany.com ».
        - Rédaction en cours d'un script de tests afin de vérifier si de tels messages auraient compromis un traitement pertinent des messages: _Récupération des IDs des « threads » auxquels appartiennent les messages envoyés [exclusivement] à l’adresse « operations@OldMailServer.com ». Vérifier les valeurs récupérées contre les journaux des messages traités._

## 2017-09-11
Evaluation des résultats des sessions d’exécution du 09/09/2017 et 10/09/2017 : **73** messages traités, dont **51** sautées et **22** réponses automatiques envoyées.

## 2017-09-12
Evaluation des résultats de la session d’exécution du 11/09/2017 : **60** itérations correctes du programme ayant récupérés **66** « threads ».  **66** messages traités, dont **45** sautées et **21** réponses automatiques envoyées.
Un message récupéré depuis la boîte email « operations@OldMailServer.com » n’a pas été traité. L’hypothèse établie dans le rapport du 09/09/2017 se tient.

## 2017-09-13
Evaluation des résultats de la session d’exécution du 12/09/2017 : **60** itérations correctes du programme ayant récupérés **53** « threads ».  **53** messages traités, dont **42** sautées et 11 réponses automatiques envoyées.

## 2017-09-14
Evaluation des résultats de la session d’exécution du 13/09/2017 : **60** itérations correctes du programme ayant récupérés **33** « threads ». **33** messages traités, dont **19** sautées et **14** réponses automatiques envoyées.
Déploiement de versions adaptées du programme pour les deux comptes **« OPERATIONS2 »** et **« OPERATIONS3 »**.

## 2017-09-16 (code)
Evaluation des résultats des sessions d’exécution du 14/09/2017 et 15/09/2017.
- Améliorations et mises à jour :
    - Ajout d'une nouvelle adresse aux listes d’exclusions respectives « From : » de chaque compte (i.e. OPERATIONS, OPERATIONS2, OPERATIONS3).
    - Modification du code pour la mise en copie normale « Cc » (au lieu de « Cci ») des adresses d’administration « IT »  pour un meilleur filtrage et suivi des réponses automatiques envoyées (i.e. pour une meilleure lisibilité sur l’application web « Gmail » avec des libellés personnalisés, par exemple). L'adresse mise en copie est en effet un [alias](https://support.google.com/a/answer/33327?hl=en) de **« amine@mycompany.com »** utilisées pour filtrer les messages de suivi et pour l'administration système; Dans le cas des réponses automatiques programmées jusqu’au 16/09/2017, les alias sont respectivement : **it-operations@mycompany.com**, **it-operations2@mycompany.com**, **it-operations3@mycompany.com**.
    - OPERATIONS2 & OPERATIONS3 : A partir de la session d’exécution du 16/09/2017, le système de filtrage des messages reçus par destination vérifiera les champs « Cc : » et « Cci : » en plus du champ « To : ».
    - _Prévisions :_ Comme [un identifiant unique](https://developers.google.com/apps-script/reference/gmail/gmail-message#getid) est attribué à chaque version d’un même message envoyé à plusieurs destinataires de **`*@mycompany.*`**, il va falloir penser à un autre critère de filtrage de tels messages pour qu’ils ne soient pas traités plusieurs fois. L’identifiant **« Message-ID »**, selon les spécifications du document **[« RFC 822 »](https://www.w3.org/Protocols/rfc822/)** de l’ **« IETF »**, répond le plus aux critères requis. Une expression régulière pour l’extraction de cet identifiant a été développée et préparée pour utilisation dans de prochaines versions du programme : **```^Message-ID:\s*[<A-Za-z0-9!#$%&'*+-/=?^_`{}|~.@]*```**

## 2017-09-18 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/08dc17b8f5093e67425b3b0bba5a68a785cb597d/app/Code.js)
Evaluation des résultats des sessions d’exécution du 16/09/2017 et 17/09/2017 : **31** réponses automatiques envoyées :
- OPERATIONS :
    - **120** itérations du programme ayant récupérés **84** « threads ». **84** messages traités, dont **63** sautées et **21** réponses automatiques envoyées.
- OPERATIONS2 :
    - **120** itérations du programme ayant récupérés **53** « threads ».  **53** messages traités, dont **51** sautées et **2** réponses automatiques envoyées.
- OPERATIONS3 :
    - **120** itérations du programme ayant récupérés **95** « threads ».  **95** messages traités, dont **88** sautées et **7** réponses automatiques envoyées.
- _Améliorations et mises à jour_ :
    - Les codes source ont été mis à jour pour activer le suivi (= ajouter « une étoile » au message sur le client webmail « Gmail ») de chaque message traité.

## 2017-09-19 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/9b825e3b7dafaad3b451870d59593596bdb3afdb/app/Autorespond-config-OPS3.xlsx)
- Evaluation des résultats des sessions d’exécution du 18/09/2017: **19** réponses automatiques envoyées :
    - **OPERATIONS** : **60** itérations du programme ayant récupérés **68** « threads ». **68** messages traités, dont **50** sautés et **18** réponses automatiques envoyées.
    - **OPERATIONS2** :
        - **60** itérations du programme ayant récupérés **38** « threads ».  **38** messages traités et  sautés.
        - **1** message non traité:
            - L’heure de réception a coïncidé avec le déclenchement de la deuxième itération du programme pendant la session d’exécution du 18/09/2017. La partie du code recherchant et récupérant les derniers mails reçus l’aurait, par conséquent, raté.
            - Le script du compte « OPERATIONS3 » a détecté et sauté le message, comme il est configuré pour exclure les messages à destination de OPERATIONS et OPERATIONS2 (adresses respectives ajoutées à la colonne `TO_BLACKLIST` du fichier de configuration `Autorespond-config` de la version de l'application associée au compte Google `OPERATIONS3`).
            - Le script du compte « OPERATIONS » n’a pas détecté le message vu que l’itération qu’il l’aurait traité (exécutée à 19:26:02 GMT) a détecté un message plus récent dans la même conversation et auquel une réponse a été en effet envoyée.
            - De toute façon, le message a été traité peu après par l’équipe « OPERATIONS2 » même.
    - **OPERATIONS3** : **60** itérations du programme ayant récupérés **25** « threads ». **25** messages traités, dont **24** sautés et une réponse envoyée.
- Ajout du fichier `Autorespond-config-OPS3.xlsx` au code source:
    - Un deuxième modèle du fichier `Autorespond-config` a été ajouté au code source, illustrant -à titre d'exemple- la configuration utilisée pour l'application associée au compte **`OPERATIONS3`**, l'empêchant d'envoyer une réponse à un message réçu si celui-ci est aussi destiné au moins à l'une des adresses `operations@mycompany.com` et `operations3@mycompany.com` et serait donc traité par l'une des applications respectives leur étant associées.
    - A cet égard, les 3 instances en exécution sont en effet configurées comme suit:
        - _OPERATIONS :_ Traite tous les messages répondant aux critères préconfigurés, soient:
            - Les accusés de lectures
            - Les messages d'administration système (`postmaster`, `mailer-daemon`)
            - Les messages en provenance des adresses mail de la société (`*@mycompany.*`)
            - Les messages en provenance des adresses avec l'alias `noreply/no-reply`.
            - Adresses ajoutées au fur et à mesure à la liste d'exclusion `FROM_REGEX_BLACKLIST`
            - Messages à destinations anonymes `undisclosed-recipients`.
        - _OPERATIONS2 :_ ne traite pas les messages destinés aussi à `operations@mycompany.com`.
        - _OPERATIONS3 :_ ne traite pas les messages destinés aussi au moins à l'une des adresses `operations@mycompany.com` et `operations2@mycompany.com`.
    - Une même approche sera adoptée pour les autres instances de l'application qui seraient ultérieurement ajoutées et associées à d'autres adresses.

## 2017-09-20 [(code)](https://git.amindeed.com/amindeed/gmail-autoresponder-new/src/commit/43faa05d138d3c951af9ed6533ff9110e2d855f1/app/Code.js)
- Evaluation des résultats des sessions d’exécution du 19/09/2017: **26** réponses envoyées :
- **Mise à jour du code:** Extension de deux minutes de l’intervalle de recherche des derniers emails reçus sur chacune des trois boîtes emails à chaque itération du programme afin de ne pas rater les emails coïncidant avec l’instant d’exécution.

## 2017-09-22
Evaluation des résultats des sessions d’exécution du 20/09/2017 et 21/09/2017: **23** réponses envoyées.

## 2017-09-23
Configuration du programme de réponses mail automatique pour un quatrième compte Google: **`OPERATIONS4 <operations4@mycompany.com>`**.

## 2017-10-03
Retour sur les résultats des sessions d’exécution des programmes de réponses mail automatiques associés aux comptes OPERATIONS, OPERATIONS2, OPERATIONS3 et OPERATIONS4 entre le 22/09/2017 et 02/10/2017.
- _Premières remarques_ :
    - Aucun filtrage n’a été appliqué aux messages reçus durant la session du 01/10/2017 et le 02/10/2017 du programme de OPERATIONS2. Une réponse automatique a été envoyée pour chaque message détecté et traité.
    - La nécessité d’ajouter une colonne au journal contenant l’éventuelle raison d’exclusion d’un message se confirme.
    - La couleur de remplissage des lignes, distinguant les messages sautés des réponses automatiques envoyée, n’a pas été correctement appliquée entre le 24/09/2017 et le 30/09/2017 aux journaux de OPERATIONS et OPERATIONS. Il ne peut s’agir que d’un bug/disfonctionnement du programme.

## 2017-10-05
Etudes, rectification et suggestion d’amélioration suite aux remarques formulées dans le rapport du 03/10/2017:
- Rectification du fichier de configuration du programme de OPERATIONS2 auquel une opération d’archivage a été appliquée par erreur ; ce qui causait le traitement de l’intégralité des messages reçu sans aucun filtrage.
- Une amélioration du code est à envisager suite aux erreurs reportées par le service « Google Apps Script » :

    ![2017-10-05 - Gmail-AutoResponder](/assets/2017-10-05%20-%20Gmail-AutoResponder.png)

    - Les messages d’erreur `Argument too large: subject (line 97, file "Code") et Limit Exceeded: Email Body Size. (line 97, file "Code")` indiquent que le corps du message de réponse composé du texte informatif principal et de l’historique de la conversation peut potentiellement dépasser la limite de [la taille maximale du corps de message de réponse](https://developers.google.com/apps-script/reference/gmail/gmail-thread#reply(String)).
    - Le concept permettant de contourner ce problème peut être résumé comme suit :
        - L’ensemble du message (texte informatif + historique de la conversation) sera initialement stocké dans une chaîne de caractère (String).
        - Si la taille de la chaîne dépasse 20Ko l’excédent sera éliminé et remplacé par des points de suspension.

## 2017-10-21
Configurations de programmes de réponses mail automatiques pour les comptes OPERATIONS5 « operations5@mycompany.com »  et OPERATIONS6 « operations6@mycompany.com ».
Les premières sessions seront exécutées le jour même à partir de 20:00 (heure locale).

## 2017-10-23
Les deux premières sessions d’exécution des programmes de réponses mail automatiques associés aux comptes **OPERATIONS5** et **OPERATIONS6** ont été respectivement exécuté le **21/10/2017** et le **22/10/2017**.
**4** réponses automatiques ont été envoyées, **9** messages reçus sautés.
Les adresses expéditrices avec la mention **`do-not-reply`** ont été ajoutées à la liste d’exclusion.
Les résultats des sessions **OPERATIONS5** et **OPERATIONS6** seront suivis durant toute la semaine afin de corriger toute éventuelle anomalie.
_**N.B. :**_ Depuis l’exécution de la première session de réponse mail automatique le 23/08/2017, **1203** réponses ont été envoyées.

## 2017-10-30
Les codes sources des programmes de réponses mail automatiques ont été mis à jour suite au changement de l’heure locale qui a eu lieu le 29/10/2017.

## 2017-11-01
Vérification des programmes (journaux et configurations) de réponses mail automatiques :
- L’archivage des journaux du mois d’octobre a été correctement exécuté pour toutes les instances du programme.
- Adresses ajoutées à la liste d’exclusion « From » de chacun des fichiers de configuration.

## 2017-11-08
Début d’optimisation du code source du programme de réponses mail automatiques pour une  meilleure performance d’exécution :
**_Mise à jour du code envisagés :_** Au lieu d’extraire, à chaque exécution, tous les identifiants des messages traités durant tout le mois depuis le journal des opérations ; afin de vérifier si un message n’a pas été déjà traité, le programme vérifierait juste les identifiants des messages traités dans la dernière occurrence qui seraient déjà mis en cache.

## 2017-11-09
Continuation du développement et test des premières améliorations du code source du programme des réponses mail automatiques pour une meilleure performance d’exécution.

## 2017-11-10
Continuation du développement du code amélioré du programme des réponses mail automatiques.

## 2017-11-11
Fin de la nouvelle version du code source du programme de réponses mail automatiques. Premier déploiement pour le compte OPERATIONS. Le code sera au fur et à mesure amélioré selon les résultats.

## 2017-11-13 (code)
Les sessions d’exécution du **11/11/2017** et le **12/11/2017** du programme de réponses mail automatiques du compte **OPERATIONS** se sont correctement déroulées après la dernière mise à jour du code source.
Les changements ont été généralisés sur les autres programmes des comptes **OPERATIONS2**, **OPERATIONS3**, **OPERATIONS4**, **OPERATIONS5** et **OPERATIONS6**.
Par ailleurs, des fonctions pour effacer mensuellement le journal des occurrences de chaque session d’exécution des programmes ont été ajoutées à leurs codes source respectifs.
