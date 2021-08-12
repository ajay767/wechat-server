const ChatRoom = require('../models/chatRoom');

exports.createRoom = async ({
  roomId,
  visibility = true,
  admin,
  password,
  email,
}) => {
  try {
    const rooms = await ChatRoom.find().sort('-createdAt');
    const filteredRoom = rooms.filter((room) => room.roomId === roomId);

    if (!filteredRoom.length) {
      await ChatRoom.create({
        roomId,
        visibility,
        admin,
        password,
        email,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await ChatRoom.findByIdAndDelete(req.params.id);
    res.status(204);
  } catch (error) {
    res.status(404).json({ error: 'something went wrong' });
  }
};

exports.getPublicRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ visibility: true }).sort('-createdAt');
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(400).json({ error: 'something went wrong' });
  }
};

exports.getSecretRooms = async (req, res) => {
  try {
    const { email, password } = req.headers;
    if (!email || !password) {
      throw new Error('Something went wrong');
    }
    const rooms = await ChatRoom.find({
      visibility: false,
      email,
      password,
    });

    res.status(200).json({ rooms });
  } catch (error) {
    res.status(400).json({ error: 'something went wrong' });
  }
};
