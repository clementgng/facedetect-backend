const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '66684afaa11e4d89ada0d60bbdb3245c'
});

const getApiCall = (req, res) => {
  console.log('this the url');
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.inputurl)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('Cannot fetch API'))
}

const entriesHandler = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id',"=",id)
  .returning('entries')
  .increment('entries',1)
  .then( entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('cannot find entries'))
}

module.exports = {
  entriesHandler: entriesHandler,
  getApiCall: getApiCall
}
