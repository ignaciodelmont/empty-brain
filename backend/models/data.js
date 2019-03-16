const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
* Ejemplo de Schema
* */
const dataSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    }
});

let Data = mongoose.model('Data',dataSchema);

module.exports = Data;