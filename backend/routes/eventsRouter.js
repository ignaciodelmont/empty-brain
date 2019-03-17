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
        if (!req.body.showLimit)
            req.body.showLimit = 10;
        let showLimit = req.body.showLimit;
        Event.find({
            //state: "Open"
        }).sort({
           importance: -1  // -1 means descending order
        }).then((events) => {
            let inLimitEvents = [];
            for(let i = 0; i < events.length; i++){
                if(events[i].isNear([parseFloat(req.body.location.lat),parseFloat(req.body.location.long)],parseFloat(req.body.radius))) {
                    events[i].generateState();
                    inLimitEvents = inLimitEvents.concat(events[i]);
                }
            }
            //console.log(inLimitEvents.slice(0, showLimit));
            res.send(inLimitEvents.slice(0, showLimit));
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });

    })
    .post((req,res,next) => {
        if (req.body.img)
            req.body.img = `pictures/${req.body.img}`;

        if (req.body.endTime) { 
            req.body.endTime = new Date(req.body.endTime);
        } else {
            req.body.endTime = new Date(req.body.startTime);
            req.body.endTime = req.body.endTime.setHours(req.body.endTime.getHours() + 1)
        }

        let newEvent = new Event({
                title: req.body.title,
                description: req.body.description,
                incident: req.body.incident,    // Boolean, incident? yes or no?
                startTime: new Date(req.body.startTime),
                endTime: req.body.endTime,
                location: [parseFloat(req.body.location.lat), parseFloat(req.body.location.long)],
                img: req.body.img
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
/*
        Event.find({
            _id: req.body,
            creatorID: req.body.creatorID
        }).then((event) => {

        });
*/
    })
    .delete((req,res,next) => {

    });

module.exports = eventsRouter;