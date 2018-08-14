const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const updateEntries = require('./controllers/updateEntries');
const getID = require('./controllers/grabprofile')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    users : 'cng',
    password : '1212',
    database : 'smartbraindb'
  }
});

const app = express();
app.use(bodyParser.json()); // need to use bodyParser to parse JSON objects
app.use(cors());

/*
Simplify code by making things more modular
Put large portions of code into functions and call those functions
*/

app.get('/', (req, res) => { res.send('it is working@!') }) //db.select('*').from('users')) })

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })

app.post('/signup', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { getID.idHandler(req, res, db) })

app.put('/image', (req, res) => { updateEntries.entriesHandler(req, res, db) })

app.post('/imageurl', (req, res) => { updateEntries.getApiCall(req, res) })


app.listen(process.env.PORT || 3001, () => { console.log(`app is running on port ${process.env.PORT}`) })
