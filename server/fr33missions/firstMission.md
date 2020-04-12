installer mongodb - ok
installer koajs - ok
installer mongoose - ok
installer jest - ok
installer supertest - ok

index.ts -> il demare le server - ok
model/User.ts - ok
model/Sound.ts - ok 
model/Soundbox.ts - ok
config/routes.ts -> il bind une route a un controller - ok
controller/soundController.ts -> function createSound() - ok
bind POST /sound -> soundController.createSound() - ok
__tests__/functional/createSound.test.ts - ok

- ecrire la structure de donnees
- ecrire le code pour lancer le serveur et se connecter a la bdd
- configurer une route pour post un sound
- creer un test qui lance le serveur, post un sound puis verifier que le sound est cree avec une requete suquelize dans le test


-----
TODO:
[ ] a way to verify if sound is validated (in /sound get)