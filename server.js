const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // need to use bodyParser to parse JSON objects

const database = {
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
  ]
}

app.get('/', (req, res) => {
  /*
  flawed as we need database, this will just get whatever database at the start
  on line 7 instead of updated version which is where database will come in handy
  */
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('success!');
  } else {
    res.status(400).json('Wrong email or password')
  }
  res.json('signed in');
})

app.post('/signup', (req, res) => {
  const { name, email, password} = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
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

app.listen(3000, () => {
  console.log('app is running on port 3000');
})

/*
/ - root route res = this is working
/signin - POST request = success/fail
/signup - POST request = new user created
/home/:userId - GET request to get user info
/image - PUT request = return user

res.json('signed in') will return a JSON string of "signed in"

*/
