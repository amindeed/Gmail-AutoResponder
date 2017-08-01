# Work Log

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

## 2017-07-28
Continuation de l’étude et développement du script « Google Apps Script » pour l’envoie des réponses automatiques aux messages reçus dans des plages horaires spécifiques:
- Fin de développement de la première version du script.
- Première exécution (automatique) de test pour la boîte email « operations@mycompany.com » prévue entre 28/07/2017, 20:00GMT et 29/07/2017 06:00GMT.

![2017-07-28 - Gmail-Autoresponder](/assets/2017-07-28%20-%20Gmail-Autoresponder.png)

## 2017-07-27
Continuation de l’étude et développement du script « Google Apps Script » pour l’envoie de réponses automatiques aux messages reçus dans des plages horaires spécifiques.
- **Spécifications et cahier de charges** :
    - Le script sera configuré pour exécution automatique régulière entre 20h et 6h sur chaque compte utilisateur Google .
    - Il vérifiera les derniers messages reçu. Puisque les messages sont interprétés comme des groupes de discussion par « Gmail », les discussions avec de nouveaux messages (réponses ou transferts) seront inclues.
    - Les messages en provenance des contacts de MyCompany seront exclus.
    - Option : Les messages/discussions avec le libellé Gmail « _autoRep » seront considérés comme étant déjà traités et seront donc systématiquement exclus. (voir le dernier point).
    - Traitement des messages : Envoie de corp de la réponse automatique sous forme de texte riche (HTML) suivie des informations (date, expéditeur, destinataires, objet) et une citation du contenu du message traité.
    - Attribution du libellé Gmail « _autoRep » pour marquer le message comme traité.

## 2017-07-26
Etude de faisabilité et début de développement d’un premier prototype d’un script permettant l’envoie de réponses automatiques aux messages reçus dans des plages horaires spécifiques.

![2017-07-26 - Gmail-AutoResponder](/assets/2017-07-26%20-%20Gmail-AutoResponder.png)
