# PrettyO2cm
[![Heroku](https://heroku-badge.herokuapp.com/?app=pretty-o2cm&style=flat)](http://pretty-o2cm.herokuapp.com/)
[![Dependency Status](https://david-dm.org/bpatrik/pretty-o2cm.svg)](https://david-dm.org/bpatrik/pretty-o2cm)
[![devDependency Status](https://david-dm.org/bpatrik/pretty-o2cm/dev-status.svg)](https://david-dm.org/bpatrik/pretty-o2cm#info=devDependencies)

This project aims to parse o2cm.com the `ONLINE*ONSITE COMPETITION MANAGER FOR DANCESPORT` page and present the data in a better format.
The app is not bug free, never rely only on the data presented by the app.

## Live demo:
https://pretty-o2cm.herokuapp.com

## Usage
```shell
npm install
npm start
```

## Known bugs:
- Some event are not parsed
- The point calculation are only estimation. The app thinks if an event has more tha 30 couples then it has a quarter-final too. 
