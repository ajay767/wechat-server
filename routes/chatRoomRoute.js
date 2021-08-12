const express = require('express');
const router = express.Router();
const chatRoomController = require('./../controllers/chatRoomController');

router.route('/public').get(chatRoomController.getPublicRooms);
router.route('/secret').get(chatRoomController.getSecretRooms);
router.route('/room/:id').delete(chatRoomController.deleteRoom);

module.exports = router;
