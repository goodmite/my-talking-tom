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

io.on('connection', (socket) => {
  io.to(socket.id).emit("connect_done");
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('stopped', msg => {
    io.emit('stopped', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
