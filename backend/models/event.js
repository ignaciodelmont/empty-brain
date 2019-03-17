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
        type:Boolean, // Boolean, incident? yes or no?
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{ // estimated
        type:String,
        required: true
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
        required:false,
        default: "pictures/defaultEvent.jpg" 
    },
    participants:{
        type:[String],
        default:[]
    }
    
});

/*
*  Calculate distance between points on earth
*/
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
/**
 * Determine if is near on a radius
 */
eventSchema.methods.isNear = function (center, radius) {
    let dist = getDistanceFromLatLonInKm(this.location[0], this.location[1], center[0], center[1]);
    return dist <= parseFloat(radius);
}

/**
 * Generate the event state
 */
eventSchema.methods.generateState = function () {
    if (this.incident)
        this.state = "Incident";
    else if (this.state != "Suspended" && this.state != "Delayed" && this.state != "Full") {
        let current = new Date().getTime();
        let startTime = new Date(this.startTime).getTime();
        let endTime = new Date(this.endTime).getTime();
        console.log(startTime);
        console.log(current);
        console.log(startTime - current);
        if (current >= endTime)
            this.state = "Over";
        else if ((current >= startTime) && (current < endTime))
            this.state = "Started";
        else if ((startTime - current) <= 300000)
            this.state = "About to start";
        else
            this.state = "Open";
    }
}

let Event = mongoose.model('Event',eventSchema);

module.exports = Event;