import React from 'react';
import 'typeface-roboto';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Typography,Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Dropzone from 'react-dropzone';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    padding:'20px'
  },
  button: {
    margin: theme.spacing(1),
  },
  dropzone:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'20vh',
    border:'solid grey 1px',
    borderRadius:'5px',
    padding:'15px',
    backgroundColor:'#E8E8E8'
  },
  formGroup:{
    height:'40vh',
    width:'30vh',
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-around'
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  icon: {
    color: 'white',
  },
  textfield:{
    width:'100%',
    margin:'20px'
  },
  title:{
    padding:'30px'
  },
  gridItem:{
    padding:'20px',
  }
}));

export default function Addmachine({titleColor,dealerColor,dealerBackgroundColor}) {
  const classes = useStyles();
  const [machine, setMachine] = React.useState({});

  const handleChange = (event,propertyName) => {
    setMachine({...machine,[propertyName]:event.target.value});
  }

  const createMachine = async() => {
    try {
  
      const machineInformations = await new Promise(async(resolve,reject)=>{
        try{
          const image = machine.image && machine.image[0]
          // console.log('machine : ',machine);
          let machineForm = new FormData();
          
          machineForm.append('filedata',image);
          machineForm.append('brand',machine.brand);
          machineForm.append('type',machine.type);
          machineForm.append('nature',machine.nature);
          
          resolve(machineForm);
        }catch(error){
          console.log('machineInformations error', error)
          reject(error);
        }
      })

      const axiosResponse = await Axios({
        method: "post",
        url: 'http://localhost:4001/post/addMachineImage',
        data:machineInformations,
        config: { headers: { "Content-Type": "multipart/form-data" } }
      });

      const {data, status} = axiosResponse
      const img = (data && data.length && data[0]) || {}
      const {location} = img

      const imageurl = await Promise.resolve(
        status === 200
        ? location
        : ""
      );
              
      console.log('s3 uploaded image url : ', imageurl || 'no url received');

    } catch(e) {
      console.log('addMachine error', e || 'null')
    }
  }

  console.log('machine updated: ', machine)

  return (
    <div>
      <div className={classes.title}>
        <Typography variant='h6' style={{color:titleColor}}>Ajouter une nouvelle machine à votre catalogue</Typography>
      </div>
    

    <Grid container spacing={5}>
      <form className={classes.root}>
        <Grid item xs={12} lg={4} className={classes.gridItem}>
          <TextField
                className={classes.textfield}
                id="outlined-name"
                label="Nature"
                placeholder='Tracteur, presse...'
                value={machine&&machine.nature&&machine.nature}
                onChange={(event)=>handleChange(event,'nature')}
                variant="outlined"
              />
              <TextField
                className={classes.textfield}
                id="outlined-name"
                label="Marque"
                placeholder='Marque'
                value={machine&&machine.brand&&machine.brand}
                onChange={(event)=>handleChange(event,'brand')}
                variant="outlined"
              />
              <TextField
                className={classes.textfield}
                id="outlined-name"
                label="Modèle"
                placeholder='Modèle'
                value={machine&&machine.type&&machine.type}
                onChange={(event)=>handleChange(event,'type')}
                variant="outlined"
              />
        </Grid>
        <Grid item xs={12} lg={4} className={classes.gridItem}>
          <TextField
                className={classes.textfield}
                id="outlined-name"
                label="Options"
                placeholder='Relevage avant, chargeur, autoguidage...'
                value={machine&&machine.options&&machine.options}
                onChange={(event)=>handleChange(event,'options')}
                variant="outlined"
              />
              <TextField
                className={classes.textfield}
                id="outlined-name"
                label="Prix à l'heure"
                placeholder='Tarif horaire de votre machine'
                value={machine&&machine.hour_price&&machine.hour_price}
                onChange={(event)=>handleChange(event,'hour_price')}
                variant="outlined"
              />
              <TextField
                className={classes.textfield}
                id="outlined-name"
                label="Prix à la journée"
                placeholder='Tarif journalier de votre machine'
                value={machine&&machine.day_price&&machine.day_price}
                onChange={(event)=>handleChange(event,'day_price')}
                variant="outlined"
              />
        </Grid>
        <Grid item xs={12} lg={4} className={classes.gridItem} style={{alignSelf:'center'}}>
          <Dropzone onDrop={acceptedFiles => setMachine({...machine,image:acceptedFiles})}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div className={classes.dropzone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div>
                    <PhotoCamera />
                    <Typography variant='h6'>Glisser votre image ici</Typography>
                    <Typography variant='subtitle1'>ou cliquez pour la sélectionner</Typography>


                  </div>
                
                
                </div>
              </section>
            )}
          </Dropzone>
        
          <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
                style={{color:dealerColor,backgroundColor:dealerBackgroundColor}}
                onClick={createMachine}
              >
                VALIDER
              </Button>
        </Grid>
      </form>
    </Grid>
      
      
    </div>
  );
}
