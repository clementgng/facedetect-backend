
const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password} = req.body;
  if (!email) {
    return res.status(400).json('Please enter a valid email')
  } else if (!name) {
    return res.status(400).json('Please enter a valid name')
  } else if(!password) {
    return res.status(400).json('Please enter a password')
  } else {
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
  }
}

module.exports = {
  handleRegister: handleRegister
}
