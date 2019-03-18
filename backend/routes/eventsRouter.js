const express = require('express');
const Event = require('../models/event');
const bodyParser = require('body-parser');
const {mongoose} = require('../db/mongoose');
let eventsRouter = express.Router();

/**
 * Use body-parser
 */
eventsRouter.use(bodyParser.json());
/**
 * Methods for /events
 */
eventsRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        next();
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
                res.statusCode = 409;
                
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
                console.log("added OK");
                res.send("Participant " + newReq.name + " was added!");
            })
            .catch((err2)=>{
                res.statusCode = 500;
                res.send(err2);
            });
        }).catch((err)=>{
            res.statusCode = 400;
            res.send(err);
        });
        
    });

/**
 * Methods for /events/:name
 */
eventsRouter.route('/:name')
    .get((req,res,next)=>{
        let queryName = req.params.name;
        Event.find({title:{ $regex: (new RegExp(queryName, "i")), $options: 'i'}})
            .then((events)=>{
                res.statusCode = 200;
                res.json(events);
            }).catch((err)=>{
                res.statusCode = 404;
                res.send(err);
            });
    });

eventsRouter.route('/:radius/:lat/:long')
    .get((req,res,next)=>{
        let radius = req.params.radius;
        let lat = req.params.lat;
        let long = req.params.long;
        if (  !lat || !long || !radius) {
            res.send("Not all required parameters were sent");
            return;
        }
        let showLimit = 1000;
        Event.find({
            $or: [ { state:"Open" }, { state:"About to start" } ] 
        }).limit(200).sort({
           importance: -1  // -1 means descending order
        }).then((events) => {
            let inLimitEvents = [];
            for(let i = 0; i < events.length; i++){
                if(events[i].isNear([parseFloat(lat),parseFloat(long)],parseFloat(radius))) {
                    events[i].generateState();
                    if (events[i].state == "Open" || events[i].state == "About to start")
                        inLimitEvents = inLimitEvents.concat(events[i]);
                }
            }
            res.json(inLimitEvents.slice(0, showLimit));
        }).catch((err) => {
            res.statusCode = 500;
            console.log(err);
            res.send(err);
        });
    });

module.exports = eventsRouter;