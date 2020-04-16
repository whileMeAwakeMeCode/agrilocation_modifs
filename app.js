const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Customer = require('./models/customer');

const app = express();

mongoose.connect('mongodb+srv://mikl_LG:Rakord.2018$@cluster0-tfntu.mongodb.net/test?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

/**CORS POLICY */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.get('/',(req, res, next) => {
    res.status(200).json({message:'requete GET reçue'});
    next();
});

app.post('/customer', (req, res, next) => {
    //delete req.body._id;
    const customer = new Customer({
      ...req.body
    });
   
    customer.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !', customer:customer}))
      .catch(error => res.status(400).json({ error }));
  });

app.use((req, res) => {
    res.status(200).end('Success');
  console.log('Réponse envoyée avec succès !');
});

module.exports = app;