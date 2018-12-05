const { Router } = require('express')
const { getPriceListPDF } = require('../controllers/index')
const router = Router()

router.get('/price-list', getPriceListPDF)

module.exports = router
