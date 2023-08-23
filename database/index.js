const mongoose = require('mongoose');
const{Url}= require('../app/config');

mongoose.connect(Url)

const db=mongoose.connection;

module.exports =db;