const express = require('express');
const Event = require('../models/event');
let eventsRouter = express.Router();

eventsRouter.route('/')
    .all((req,res,next)=>{
        res.statusCode = 200;
        next();
    })
    .get((req,res,next)=>{
        res.end("hello");
    })
    .post((req,res,next)=>{
        let event = new Event({
                title: req.body.title,
                description: req.body.description,
                state: req.body.state,
                type: req.body.type,
                startTime: req.body.startTime,
                duration: req.body.duration,
                location: req.body.location
            });
    })
    .delete((req,res,next)=>{

    });

module.exports = eventsRouter;