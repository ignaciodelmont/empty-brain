const express = require('express');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');

var app = express();