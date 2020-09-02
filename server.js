const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');

const helmet = require("helmet");

const server = express();

//global middleware
server.use(express.json());//built in middlware
server.use(helmet());// third party security middleware
server.use(logger())//custom middleware

server.use('/api/hubs', gate('mellon'), hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get('/toss', flip, (req, res) => {
res.status(200).json({ toss: req.coin ? 'Heads' : 'Tails'})
})

function logger() {
  return function(req, res, next) {
    console.log(`a ${req.method} request was made to ${req.url}`);
    next()
}
}

function flip(req, res, next) {
const flip = Math.round(Math.random());
flip === 1 ? req.coin = true : req.coin = false;
next()
}

//gate middleware will check passwords to make sure they match, headers and provided password
function gate(password) {
  return function (req, res, next) {
    req.headers.password === password ? next() : res.status(401).json({ error: 'incorrect password' })
  }
}

module.exports = server;
