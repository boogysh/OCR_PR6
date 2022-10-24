const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const stuffCtrl = require('../controllers/stuff')

router.post('/', auth, multer, stuffCtrl.createSauce);   
router.post('/:id/like',auth ,stuffCtrl.likeSauce);        
router.get('/',auth, stuffCtrl.getSauce);
router.put('/:id',auth, multer, stuffCtrl.modifySauce);
router.delete('/:id',auth, stuffCtrl.deleteSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
//-------
module.exports = router
