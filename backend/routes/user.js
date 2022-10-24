const express = require('express')
const router = express.Router()
const raterLimit = require("express-rate-limit");

//----------
const limiter = raterLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 50, // 50 times
});
//------------

const userCtrl = require('../controllers/user')

router.post('/signup', userCtrl.signup)
router.post('/login', limiter, userCtrl.login)

module.exports = router