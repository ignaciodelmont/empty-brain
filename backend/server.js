/* Server.js */
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const hostname =  '172.20.37.140';
const port = normalizePort(process.env.PORT || '3000');
const express = require('express');
const app = express();
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');

/*
* Routers
* */
const eventRouter = require('./routes/eventsRouter');
app.use('/events',eventRouter);

// For Development
const debug = require('debug')('server:server');
const morgan = require('morgan');

/*
  Set port
*/
app.set('port', port);

/*
  Parse body data from JSON
 **/
app.use(bodyParser.json());

/*
  Set the log file for developing
* */
let logFile = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan(formatLog, { stream: logFile }));

/*
* Set options for static content
*/
let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false
};

/**
 * Static content available on '/public' folder
 */
app.use('/',express.static(path.join(__dirname, 'public'), [options]));

/*
 *Dummy response

app.get('/data',(req,res)=>{
    Event.find({}).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
    });
});
app.get('/data/:name',(req,res)=>{
    let reqName = req.params.name;
    Event.find({"name":{$lte:reqName}}).then((data)=>{
        if (data.length>0)
            res.json(data);
        else
            res.send("No results");
    }).catch((err)=>{
        console.log(err);
    });
});
app.post('/reg',(req,res)=>{
    let newData = new Event({
        name: req.body.name,
        lastName : req.body.lastName
    });
    newData.save().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        res.statusCode = 404;
        res.send("Please complete the data");
    });
});
*/
/**
 Create HTTP server.
 */
let server = http.createServer(app);

/**
 Listen on provided port, on all network interfaces.
 */
server.listen(port,hostname,()=>{
    console.log(`Server running on http://${hostname}:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

/*
  Format the log file content
**/
function formatLog(tokens, req, res){
    return [
        tokens.method(req,res),
        tokens.url(req,res),
        tokens.status(req,res),
        "req-body: ",JSON.stringify(req.body),"-",
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}