
const express = require("express")
const { getUser, updateUser, fetchUser } = require('../controllers/user.js')
const router = express.Router();

router.get('/', fetchUser) 
router.get('/find/:userId', getUser)
router.put('/', updateUser)

module.exports = router