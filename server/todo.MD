## Routes
- [ ] User
  - [X] GET - ./user/:id
  - [X] POST - ./user/login - { mail, password }
  - [X] POST - ./user/register - { username, mail, password, passwordVerification, adult }
  - [ ] POST - ./user/recover - { mail }
  - [X] DELETE - ./user/:id - { mail }
    - The delete function need to be refactor, we don't want to delete a real user but changing his informations to maybe keep sounds/soundboxes before total wipe maybe? Or doing a total wiping of this user.

- [ ] Sound
  - [X] GET - ./sounds
  - [X] GET - ./sounds/user/:id
  - [X] GET - ./sound/:id
  - [ ] GET - ./sounds/pending
  - [ ] POST - ./sound - { soundFile, name, desc, owner }
    - TODO: File retrieving
  - [ ] PATCH - ./sound/:id - { changedValues }
  - [ ] PATCH - ./sound/moderate/:id
  - [X] DELETE - ./sound/:id
  - [ ] DELETE - ./sounds/user/:id

- [ ] Soundbox
  - [ ] GET - ./soundbox
  - [ ] GET - ./soundbox/:id
  - [ ] GET - ./soundboxes/user/:id
  - [ ] POST - ./soundbox
  - [ ] PATCH - ./soundbox/:id
  - [ ] DELETE - ./soundbox/:id
  - [ ] DELETE - ./soundboxes/user/:id


## Thanks for watching the stream! See y'all later! Much love! :)