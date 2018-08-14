const handleSignIn = (req, res, db, bcrypt) => {
  const {email, password} = req.body
  if (!email || !password) {
    return res.status(400).json('Invalid email/password');
  }
  db.select('email', 'hash').from('login')
  .where('email', '=', email)
  .then(data => {
    const loginData = data[0];
    const isValidPassword = bcrypt.compareSync(password, loginData.hash);
    if (isValidPassword) {
      return db.select('*').from('users')
      .where('email', '=', email)
      .then(user => {
        res.json(user[0])
      })
      .catch(err => res.status(400).json('Could not sign in'))
    } else {
      res.status(400).json('Invalid email or password')
    }
  })
  .catch(err => res.status(400).json('Invalid user credentials'))
}

module.exports = {
  handleSignIn: handleSignIn
}
