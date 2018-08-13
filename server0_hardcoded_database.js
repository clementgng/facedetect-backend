const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

/*const postgres = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    users : 'postgres',
    password : '',
    database : 'smartbrain'
  }
});

// console.log(postgres.select('*').from('users'));
// postgres.select('*').from('users') RETURNS A PROMISE
postgres.select('*').from('users').then(data => { // dont need to convert to JSON as it is not http
  console.log(data);
});*/

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    users : 'postgres',
    password : '',
    database : 'smartbrain'
  }
});

const app = express();
app.use(bodyParser.json()); // need to use bodyParser to parse JSON objects
app.use(cors());

/*const database = {
  users: [
    {
      id: '123',
      name: 'Clement',
      email: 'clement@boss.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@boss.com',
      password: 'milk',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'clement@boss.com'
    }
  ]
}*/

app.get('/', (req, res) => {
  /*
  flawed as we need database, this will just get whatever database at the start
  on line 7 instead of updated version which is where database will come in handy
  */
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare("boss", '$2a$10$ZLCwHW9SBkIyAdsWaeH76Or1zfDNsD.5lV65aB.fImbRJ2Y8xbfwu', function(err, res) {
      // res == true
      console.log('first guess', res);
  });
  bcrypt.compare("veggies", '$2a$10$ZLCwHW9SBkIyAdsWaeH76Or1zfDNsD.5lV65aB.fImbRJ2Y8xbfwu', function(err, res) {
      // res = false
      console.log('second guess', res);
  });

  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('Wrong email or password')
  }
  // res.json('signed in');
})

app.post('/signup', (req, res) => {
  const { name, email, password} = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
      // Store hash in your password DB.
      console.log(hash);
  });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  })
  console.log(database.users[2])
  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      return res.json(user);
    } /*else {
      res.status(404).json('User does not exist');
    }*/
  })
  if (!found) {
    res.status(400).json('User does not exist');
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    } /*else {
      res.status(404).json('User does not exist');
    }*/
  })
  if (!found) {
    res.status(400).json('User does not exist');
  }
})


app.listen(3001, () => {
  console.log('app is running on port 3001');
})

/*
/ - root route res = this is working
/signin - POST request = success/fail
/signup - POST request = new user created
/home/:userId - GET request to get user info
/image - PUT request = return user

res.json('signed in') will return a JSON string of "signed in"

always use HTTPS when sending sensitive info from frontend to backend in a POST body

*/

/*

$ npm install bcrypt
/*
* You can copy and run the code below to play around with bcrypt
* However this is for demonstration purposes only. Use these concepts
* to adapt to your own project needs.


import bcrypt from'bcrypt'
const saltRounds = 10 // increase this if you want more iterations
const userPassword = 'supersecretpassword'
const randomPassword = 'fakepassword'

const storeUserPassword = (password, salt) =>
  bcrypt.hash(password, salt).then(storeHashInDatabase)

const storeHashInDatabase = (hash) => {
   // Store the hash in your password DB
   return hash // For now we are returning the hash for testing at the bottom
}

// Returns true if user password is correct, returns false otherwise
const checkUserPassword = (enteredPassword, storedPasswordHash) =>
  bcrypt.compare(enteredPassword, storedPasswordHash)


// This is for demonstration purposes only.
storeUserPassword(userPassword, saltRounds)
  .then(hash =>
    // change param userPassword to randomPassword to get false
    checkUserPassword(userPassword, hash)
  )
  .then(console.log)
  .catch(console.error)

*/
