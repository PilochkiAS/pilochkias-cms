const axios = require('axios')
const cacheHelper = require('../api/data-cache-helper')
const PDFDocument = require('pdfkit')
const Products = require('../models/products')

module.exports = {
  async getPriceListPDF (req, res, next) {
    try {
      const products = Products.find()
      products.sort({ number: 1 })

      products.exec(async (err, docs) => {
        if (err) {
          res.status(500).send({error: {message: err.message, info: err }})
          return
        }

        let pdfContent = []
        pdfContent.push(['Наименование', 'Цена', 'Скидка'])

        docs.forEach(elem => {
          pdfContent.push([elem.title, elem.price + 'грн', elem.discount ? elem.discount + 'грн' : '-'])
          // pdfContent += `Наименование: ${elem.title} \n`
          // pdfContent += `Цена: ${elem.price} \n`
          // pdfContent += `Скидка: ${elem.discount ? elem.discount : '-'} \n\n`
        })

        generatePDFv2(res, pdfContent)
      })

    } catch (err) {
      res.status(500).send({ error: { message: err.message, info: err }})
    }
  }
};

function generatePDFv2 (res, data) {
  const doc = new PDFDocument()
  let filename = 'PilochkiAS_price-list'
  // Stripping special characters
  filename = encodeURIComponent(filename) + '.pdf'

  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
  res.setHeader('Content-type', 'application/pdf')

  // doc.font('server/DejaVuSans.ttf').fontSize(12).text(text, 50, 100)
  doc.y = 100
  createTable(doc, data)
  doc.y = 300
  doc.font('server/DejaVuSans.ttf').fontSize(25).text('PilochkiAS\n', 100, 50)

  doc.pipe(res)
  doc.end()
}

function createTable(doc, data, width = 500) {
  const startY = doc.y,
    startX = doc.x,
    distanceY = 25,
    distanceX = 10

  doc.fontSize(12)

  let currentY = startY

  data.forEach((value, i) => {
    let currentX = startX,
      size = value.length

    // let blockSize = width / size
    let blockSize

    value.forEach((text, index) => {
      //Write text
      doc.font('server/DejaVuSans.ttf').text(text, currentX + distanceX, currentY)

      if (index === 0) {
        blockSize = 300
      }
      if (index === 1) {
        blockSize = 100
      }
      if (index === 2) {
        blockSize = 100
      }

      doc
        .lineJoin("miter")
        .rect(currentX, currentY, blockSize, distanceY)
        .stroke()

      currentX += blockSize
    });

    currentY += distanceY
  });
}
