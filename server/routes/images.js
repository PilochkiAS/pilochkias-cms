const express = require('express');
const moment = require('moment');
const controller = require('../controllers/images-controller')
const multer  = require('multer')

const router = express.Router();

const upload  = multer({
  dist: '/uploads/',
  limit: {
    fileSize: 1024 * 1024 * 5
  }
})

router.use(function timeLog(req, res, next) {
  // console.log(
  //   '==>'.green ,
  //   'Time: '.blue,
  //   moment().format('DD.MM.YY, h:mm:ss a'),
  //   '||'.green,
  //   req.originalUrl
  // );
  next();
});

router.get('/images', controller.getImages)
router.get('/image/:id', controller.getImageById)
router.post('/images', upload.single('productImage'), controller.createImage)
// router.put('/product/:id', controller.createOrUpdateProduct)
router.delete('/image/:id', controller.removeImage)

module.exports = router


