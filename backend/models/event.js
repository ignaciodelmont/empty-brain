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
        type:String,
        default:"Open"
    },
    incident:{
        type:Boolean,
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{ // estimated
        type:Date
    },
    location:{
        type:[Number],
        required:true
    },
    importance:{
        type:Number,
        default:0
    },
    creatorContact:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:false 
    },
    participants:{
        type:[String]
    }
    
});


function deg2rad(deg) { return deg * (Math.PI/180); }
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1); 
    let a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
}

eventSchema.methods.isNear = function (center, radius) {
    let dist = getDistanceFromLatLonInKm(this.location[0], this.location[1], center[0], center[1]);
    console.log(dist);
    return dist <= parseFloat(radius);
}

eventSchema.methods.generateState = function () {
    if (this.incident)
        this.state = "Incident";
    else if (this.state != "Suspended" && this.state != "Delayed" && this.state != "Full") {
        let current = new Date();
        current = current.getTime();
        if (this.endTime && current >= this.endTime.getTime())
            this.state = "Over";
        else if (current >= this.startTime.getTime())
            this.state = "Started";
        else if (current < (this.startTime.getTime() - 60*5))
            this.state = "About to start";
        else
            this.state = "Open";
    }
}

let Event = mongoose.model('Event',eventSchema);

module.exports = Event;