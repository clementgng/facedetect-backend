const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

const getApiCall = (req, res) => {
  if (req.body.inputurl.length > 0) {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.inputurl)
      .then(data => {
        res.json(data);
      })
      .catch(err => res.status(400).json('Cannot fetch API'))
  }
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
