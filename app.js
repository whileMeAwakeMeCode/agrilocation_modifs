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

app.use(bodyParser.urlencoded({ 
    parameterLimit: 100000,
    limit: '50mb',
    extended : true 
}))
app.use(bodyParser.json({limit: '50mb', extended: true}))

app.get('/',(req, res, next) => {
    res.status(200).json({message:req.body});
    //res.status(201).json({message:req.body});
    next();
});

app.post('/', (req, res, next) => {
    //delete req.body._id;
    //console.log('body : ',req.body);
    res.status(201).json({message:req});
    /*const customer = new Customer({
      ...req.body
    });
   
    customer.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !', body:req}))
      .catch(error => res.status(400).json({ error }));*/

    next();
  });

app.use((req, res) => {
    res.status(200).end('Success');
  console.log('Réponse envoyée avec succès !');
});

module.exports = app;