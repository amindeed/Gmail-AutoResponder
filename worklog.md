# Work Log

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
