const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    }
});

let Event = mongoose.model('Event',eventSchema);

module.exports = Event;