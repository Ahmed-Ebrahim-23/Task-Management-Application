const express = require('express')
const userController = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router()

router.route('/')
    .get(verifyJWT, userController.getUserById)
    .delete(verifyJWT, userController.deleteUserById)

module.exports = router;

