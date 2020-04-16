const mongoose = require('mongoose');

const customerSchema= mongoose.Schema({
    id:{type:String,required:false},
    title:{type:String,required:false},
    name:{type:String,required:false},
    firstAddress:{type:String,required:false},
    secondAddress:{type:String,required:false},
    thirdAddress:{type:String,required:false},
    postal:{type:String,required:false},
    city:{type:String,required:false},
    phone:{type:String,required:false},
    cellPhone:{type:String,required:false},
    siren:{type:String,required:false},
    email:{type:String,required:false},
});

module.exports = mongoose.model('Customer',customerSchema);