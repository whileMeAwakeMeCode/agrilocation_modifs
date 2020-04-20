const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
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
});

const addBooking = async(req, res, next)=>{
    
    const booking = req.body;

      await s3.getObject(
        {
          Bucket:'inspekt-prod',
          Key:'AGRILOCATION/machine_catalog',
        },
        (error,data)=>{
          let machine_catalog = JSON.parse(data.Body.toString());
          const machineId = machine_catalog.id;
          delete booking['id'];
          try{
            const newBookings = machine_catalog.booking;
            newBookings.push(booking);
          }catch(error){
            console.log('erreur : ',error);
          }
          
          s3.putObject(
            {
              Bucket:'inspekt-prod',
              Key:'AGRILOCATION/machine_catalog', //2 paramètres obligatoires pour toute méthode s3 (/ inplicite entre Bucket et Key)
              Body:JSON.stringify(machine_catalog) // uniquement nécessaire pour les requêtes POST
            },
            (errror,response)=>{
                res.status(
                  errror ? 400 : 201
                ).json(
                  {error,response}
                )
              
            })
        }
      )   
}

const addMachine = async(req, res, next)=>{
    
  const machine = req.body;

    await s3.getObject(
      {
        Bucket:'inspekt-prod',
        Key:'AGRILOCATION/machine_catalog',
      },
      (error,data)=>{
        let MACHINECATALOG = JSON.parse(data.Body.toString());
        try{
          const newCatalog = {...MACHINECATALOG,...machine}
          s3.putObject(
            {
              Bucket:'inspekt-prod',
              Key:'AGRILOCATION/machine_catalog', //2 paramètres obligatoires pour toute méthode s3 (/ inplicite entre Bucket et Key)
              Body:JSON.stringify(newCatalog) // uniquement nécessaire pour les requêtes POST
            },
            (errror,response)=>{
                res.status(
                  errror ? 400 : 201
                ).json(
                  {error,response}
                )
              
            })
        }catch(error){
          console.log('erreur : ',error);
        }
      }
    )   
}

const addMachineImage = (req,res,next)=>{
  res.status(200).send('Bonjourno');
}

const getMachine = (req, res, next)=>{
    s3.getObject(     
      {
        Bucket:'inspekt-prod',
        Key:'AGRILOCATION/machine_catalog', //2 paramètres obligatoires pour toute méthode s3 (/ inplicite entre Bucket et Key)
      },
      //Prévoir un check de l'existence du bucket avec (data&&data.Body&data.Body.toString()) || [] 
      //erreur de key => s3 renvoi noSuchKey
      //voir BucketActions dans le backend d'Inspekt
      (error,data)=>{
          //console.log('data : ',JSON.parse(data.Body.toString()))
          res.status(
            error ? 400 : 201
          ).send(
            {data:JSON.parse(data.Body.toString())}
          )      
      })
}
router.post('/post/addMachineImage',upload.array('filedata'),function(req,res){
  console.log('reqfiles : ',req.files);
  console.log('reqbody : ',req.body);
  res.status(200).send(req.files);
});
router.get('/get/machine',getMachine);
router.post('/post/addBooking',addBooking);
router.post('/post/addMachine',addMachine);

module.exports = router;