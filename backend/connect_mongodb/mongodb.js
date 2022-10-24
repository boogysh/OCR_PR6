const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://' + process.env.MONGO_DB_USER + ':' + process.env.MONGO_DB_PASSWORD + '@cluster0.vu7sh9s.mongodb.net/' + process.env.MONGO_DB_LEVEL_ACCESS ,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

