const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    state:{
        /*
            Open
            Running
            Closed
        */
        type:String,
        required:true
    },
    type:{
        /*
            Evento
            Suceso
        */
        type:String,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    duration:{ // estimated
        type:String,
        required:false
    },
    location:{
        type:String,
        required:true
    },
    
});

let Event = mongoose.model('Event',eventSchema);

module.exports = Event;