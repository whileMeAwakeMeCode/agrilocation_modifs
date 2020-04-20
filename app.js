const Env = require('dotenv').config() 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const agrilocationRoutes = require('./routes/agrilocation.js');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const app = express();

/*const addMachine = (req, res, next)=>{
    s3.putObject(
      {
        Bucket:'inspekt-prod',
        Key:'AGRILOCATION/machine_catalog', //2 paramètres obligatoires pour toute méthode s3 (/ inplicite entre Bucket et Key)
        Body:JSON.stringify(req.body) // uniquement nécessaire pour les requêtes POST
      },
      (error,response)=>{
          res.status(
            error ? 400 : 201
          ).json(
            {error,response}
          )      
      })
}*/

/*const getCustomers = (req, res, next)=>{
  s3.getObject(
    {
      Bucket:'inspekt-prod',
      Key:'AGRILOCATION/customer_catalog', //2 paramètres obligatoires pour toute méthode s3 (/ inplicite entre Bucket et Key)
    },
    (error,data)=>{
        res.status(
          error ? 400 : 201
        ).send(
          {data:JSON.parse(data.Body.toString())}
        )
    })
}*/

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
});

//app.use('/',agrilocationRoutes);

app.post('/post/addMachineImage',upload.array('filedata'),function(req,res){
  console.log('reqfiles : ',req.files);
  console.log('reqbody : ',req.body);
  res.status(200).send(req.files);
});

app.listen(4001, () => console.log(`Agrilocation server running on 4001`));