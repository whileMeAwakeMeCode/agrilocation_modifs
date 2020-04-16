//const Env = require('dotenv').config() 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const multer = require('multer');
//const multerS3 = require('multer-s3');
//const aws = require('aws-sdk');

const app = express();

/*aws.config.update({
  accessKeyId:process.env.S3_ACCESS_KEY_ID,  
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, 
  region:process.env.S3_REGION        
})

const s3 = new aws.S3();
const upload = multer({
  storage:multerS3({
      s3,
      bucket:process.env.S3_MEDIAS_BUCKET,    
      contentType:multerS3.AUTO_CONTENT_TYPE,
      acl:'public-read',
      metadata:function(req,file,callback){callback(null,{fieldName:file.fieldname})},
      key:function(req,file,callback){callback(null,'inspekt_'+Date.now())},
  })
});*/

app.use((req,res,next)=>{
  if(req.originalUrl === '/favicon.ico'){
      res.status(204).json({nope:true});
  }else{
      next();
  }
})

/// enable CORS ///
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*"); 
    res.header('Access-Control-Allow-Headers', "Content-Type, X-Requested-With, Origin, Accept");
    next()
})

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

app.post('/', 
//upload.array('filedata'),
(req, res, next) => {
    //delete req.body._id;
    //console.log('body : ',req.body);
    res.status(201).json({message:req.body});
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