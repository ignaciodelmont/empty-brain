const express = require('express');
const Event = require('../models/event');
const bodyParser = require('body-parser');
const {mongoose} = require('../db/mongoose');
let eventsRouter = express.Router();


eventsRouter.use(bodyParser.json());

eventsRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        next();
    })
    .get((req,res,next) => {
        let newReq = req.body;
        if (!newReq.location || !newReq.location.lat || !newReq.location.long || !newReq.radius) {
            res.send("Not all required parameters were sent");
            return;
        }
        if (!newReq.showLimit)
            newReq.showLimit = 10;
        Event.find({
            state:"open"
        }).sort({
           importance: -1  // -1 means descending order
        }).then((events) => {
            let inLimitEvents = [];
            for(let i = 0; i < events.length; i++){
                if(events[i].isNear([parseFloat(newReq.location.lat),parseFloat(newReq.location.long)],parseFloat(newReq.radius))) {
                    events[i].generateState();
                    inLimitEvents = inLimitEvents.concat(events[i]);
                }
            }
            res.send(inLimitEvents.slice(0, newReq.showLimit));
        }).catch((err) => {
            console.log(err);
            res.send("Catched in get/events: " + err.toString());
        });

    })
    .post((req,res,next) => {
        let newReq = req.body;
        if (newReq.img)
            newReq.img = `pictures/${newReq.img}`;

        let newEvent = new Event({
                title: newReq.title,
                description: newReq.description,
                incident: newReq.incident,    
                startTime:newReq.startTime,
                endTime: newReq.endTime,
                location: [parseFloat(newReq.location.lat), parseFloat(newReq.location.long)],
                img: newReq.img,
                creatorContact: newReq.creatorContact
        });
        newEvent.generateState();
        newEvent.save()
            .then((event) => {
                console.log(event);
                res.send(event);
            })
            .catch((err) => {
                res.statusCode = 400;
                console.log(err);
                res.send(err);
            });
    })
    .patch((req,res,next) => {
        let newReq = req.body;
        Event.findById(newReq.id)
        .then((event) => {
            if (event.participants.includes(newReq.name)) {
                console.log("Participant " + newReq.name + " is already in list!");
                res.send("Participant " + newReq.name + " is already in list!");
                return;
            }
            let newParticipantList = event.participants.concat(newReq.name);
            Event.findByIdAndUpdate(newReq.id,{
                $set:{
                    participants:newParticipantList
                }
            })
            .then((event2)=>{
                console.log("Participant " + newReq.name + " was added!");
                res.send("Participant " + newReq.name + " was added!");
            })
            .catch((err2)=>{
                res.send(err2);
            });
        }).catch((err)=>{
            res.send(err);
        });
        
    });

eventsRouter.route('/:name')
    .get((req,res,next)=>{
        let queryName = req.params.name;
        Event.find({title:{ $regex: (new RegExp(queryName, "i")), $options: 'i'}})
            .then((events)=>{
                res.send(events);
            }).catch((err)=>{
                res.send(err);
            });
    });
module.exports = eventsRouter;