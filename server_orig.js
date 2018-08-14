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
    users : 'cng',
    password : '1212',
    database : 'smartbraindb'
  }
});

const app = express();
app.use(bodyParser.json()); // need to use bodyParser to parse JSON objects
app.use(cors());

app.get('/', (req, res) => {
  /*
  flawed as we need database, this will just get whatever database at the start
  on line 7 instead of updated version which is where database will come in handy
  */
  res.send(db.select('*').from('users'));
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    const loginData = data[0];
    const isValidPassword = bcrypt.compareSync(req.body.password, loginData.hash);
    if (isValidPassword) {
      return db.select('*').from('users')
      .where('email', '=', req.body.email)
      .then(user => {
        res.json(user[0])
      })
      .catch(err => res.status(400).json('Could not sign in'))
    } else {
      res.status(400).json('Invalid email or password')
    }
  })
  .catch(err => res.status(400).json('Invalid user credentials'))
})

app.post('/signup', (req, res) => {
  const { name, email, password} = req.body;
  const hash = bcrypt.hashSync(password);
  /* use transaction when you need to insert things into 2+ tables in the db
    use trx to use operations throughout transaction
  */
  db.transaction(trx => {
    trx.insert({ // insert values for column
      hash: hash,
      email: email
    })
    .into('login') // insert into the login table
    .returning('email') //specify we want to return the email column from trx.insert
    .then(loginEmail => { //use email to insert into users table
      return trx('users') // use another trx transaction to return since we are inside callback function
      .returning('*') // return everything that we insert into users table
      .insert({
        email: loginEmail[0],
        name: name,
        joined: new Date()
      })
      .then(user => {
        res.json(user[0]); // respond with json
      })
      .catch(err => res.status(400).json('cannot register'))
    })
    .then(trx.commit) // use trx.commit to add transactions into the table
    .catch(trx.rollback) // rollback transaction incase of an error
  })
  .catch(err => res.status(400).json('Could not register'))
})

/*
app.post('/signup', (req, res) => {
  const { name, email, password} = req.body;
  const hash = bcrypt.hashSync(password);
  return db('users')
  .returning('*')
  .insert({
    email: email,
    name: name,
    joined: new Date()
  })
  .then(user => {
    console.log('usar',user);
    console.log(user[0]);
    res.json(user[0])
  })
  .catch(err => res.status(400).json('cannot register'))
})
*/

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where('id', id)
  .then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('User id not found');
    }

  })
  .catch(err => res.status(400).json('error getting user profile'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id',"=",id)
  .returning('entries')
  .increment('entries',1)
  .then( entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('cannot find entries'))
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
