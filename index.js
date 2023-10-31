const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8082;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.id, '有用户进来了');
  socket.on('group message', (msg, id) => {
    io.to(id).emit('group message', msg, id);
  });
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('login message', () => {
    io.emit('login message', `兄弟我(${socket.id})已经登录啦，开始聊天吧`);
  })
  socket.on('addGroup', groupId => {
    let msg = `用户, ${socket.id}, 加入了groupId为, ${groupId}, 的群聊`
    console.log(msg);
    socket.join(groupId);
  })
  socket.on('error', (error) => {
    console.log(error);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
