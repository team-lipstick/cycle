const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/util/connect');

connect('mongodb://localhost:27017/cycle');

const server = http.createServer(app);
const PORT = process.env.port || 3000;

server.listen(PORT, () => {
    // eslint-disable-next-line
    console.log('Server on', PORT);
});