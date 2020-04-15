const mongoose = require('mongoose');

const customerSchema= mongoose.Schema({
    title:{type:String,required:true},
    name:{type:String,required:true},
    firstAddress:{type:String,required:true},
    secondAddress:{type:String,required:true},
    thirdAddress:{type:String,required:true},
    postal:{type:String,required:true},
    city:{type:String,required:true},
    phone:{type:String,required:true},
    cellPhone:{type:String,required:true},
    siren:{type:String,required:true},
    email:{type:String,required:true},
});

module.exports = mongoose.model('customers',customerSchema);