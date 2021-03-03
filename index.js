const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});
var cors = require('cors')
const port = process.env.port || process.env.PORT || 3000;

app.use(cors())

app.get('/health', (req, res) => {
    res.json({port});
});

let connectCounter = 0;
let clients = [];
io.on('connection', (socket) => {
    const id = socket.handshake.query.id;
    clients.push(socket.handshake.query);
    io.emit("connect_done", {clients});
    console.log(clients);
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
    socket.on('stopped', msg => {
        io.emit('stopped', {msg, id});
    });
    // socket.on('connect', function () {
    //     ++connectCounter;
    //     io.emit('connected');
    // });
    socket.on('activity', function ({activity}) {
        const index = clients.findIndex(e => e.id === id);
        console.log('-----', clients, id, index);
        clients[index].activity = activity;
        io.emit('activity', {clients});
    });
    socket.on('disconnect', function () {
        clients = clients.filter(e => e.id !== id);
        io.emit("disconnect_done", {clients});
        console.log(clients);
        io.emit('connected');
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
