const express = require('express');
const morgan = require('morgan');
// const path = require('path');
const router = require('./router.js');
const server = express();
const port = 3000;

server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api', router)

server.listen(port, () => console.log(`listening on ${port}`))

module.exports.server = server;

