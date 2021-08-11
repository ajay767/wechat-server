const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const axios = require('axios');
const chatRoomRoute = require('./routes/chatRoomRoute');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const chatRoomController = require('./controllers/chatRoomController');

const app = express();
const server = http.Server(app);

dotenv.config({ path: './config.env' });

app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT,
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  },
});

io.on('connection', function (socket) {
  socket.on('join-room', (obj) => {
    const { roomId, name } = obj;
    socket.join(roomId);
    chatRoomController.createRoom(obj);
    socket.to(roomId).emit('greet', `Welcome ${name}`);
  });

  socket.on('to-server', ({ roomId, message, name }) => {
    console.log({ roomId, message, name });
    socket.to(roomId).emit('to-client', { message, name });
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

app.use('/api', chatRoomRoute);

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected!!');
  });

server.listen(process.env.PORT, () => {
  console.log(`server is up and running on Port ${process.env.PORT}`);
});
