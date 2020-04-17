const Env = require('dotenv').config() 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const app = express();

aws.config.update({
  accessKeyId:process.env.S3_ACCESS_KEY_ID,  
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, 
  region:process.env.S3_REGION        
})

const s3 = new aws.S3();

const uploadFile = (req, res, next)=>{
    console.log('body : ',req.body);

      s3.putObject(
        {
          Bucket:'inspekt-prod',
          Key:'AGRILOCATION/booking', //2 paramètres obligatoires pour toute méthode s3 (/ inplicite entre Bucket et Key)
          Body:JSON.stringify(req.body) // uniquement nécessaire pour les requêtes POST
        },
        (error,response)=>{
            res.status(
              error ? 400 : 201
            ).json(
              {error,response}
            )
          
        })
}

const getFile = (req, res, next)=>{

    s3.getObject(
      {
        Bucket:'inspekt-prod',
        Key:'AGRILOCATION/booking', //2 paramètres obligatoires pour toute méthode s3 (/ inplicite entre Bucket et Key)
      },
      (error,response)=>{
          res.status(
            error ? 400 : 201
          ).send(
            {error,response:response.Body.toString()}
          )
        
      })
}

const getCustomer_catalog = (req, res, next)=>{

  s3.getObject(
    {
      Bucket:'inspekt-prod',
      Key:'AGRILOCATION/customer_catalog', //2 paramètres obligatoires pour toute méthode s3 (/ inplicite entre Bucket et Key)
    },
    (error,response)=>{
        res.status(
          error ? 400 : 201
        ).send(
          {response:response.Body.toString()}
        )
      
    })
}

const upload = multer({
  storage:multerS3({
      s3,
      bucket:process.env.S3_MEDIAS_BUCKET,    
      contentType:multerS3.AUTO_CONTENT_TYPE,
      acl:'public-read',
      metadata:function(req,file,callback){callback(null,{fieldName:file.fieldname})},
      key:function(req,file,callback){callback(null,'inspekt_'+Date.now())},
  })
});

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

app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}))

app.get('/get/customer_catalog',getCustomer_catalog);

app.post('/post',uploadFile);

module.exports = app;