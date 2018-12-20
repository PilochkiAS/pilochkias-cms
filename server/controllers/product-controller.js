const axios = require('axios')
const Products = require('../models/products')
const { Types } = require('mongoose')
const ObjectId = Types.ObjectId;

module.exports = {
  /**
   *  GET /api/products
   *  query parameters:
   *  - category=[0 to 6]
   * */
  async getProducts (req, res, next) {
    const products = Products.find()

    if (req.query.category && req.query.category !== '0') {
      products.find({category: req.query.category})
    }

    let { price } = req.query

    if (price === '-1') {
      products.sort({ price: -1 })
    } else if (price === '1') {
      products.sort({ price: 1 })
    } else {
      products.sort({ number: 1 })
    }

    products.exec(async (err, docs) => {
      if (err) {
        res.status(500).send({error: {message: err.message, info: err }})
        return
      }

      res.send({
        data: docs
      })
    })
  },
  /**
   *  GET /api/product/:id
   * */
  async getProductById (req, res, next) {
    await Products.findOne({_id: ObjectId(req.params.id)}, function (err, doc) {
      if (err) {
        res.status(500).send({ error: {message: err.message, info: err }})
        return
      }

      res.send({
        data: doc
      })
    })
  },
  /**
   *  POST /api/products
   *  --------OR---------
   *  PUT /api/product/:id
   * */
  async createOrUpdateProduct (req, res, next) {
    try {
      const { id } = req.params
      const data = req.body
      let product = {}

      if (id) {
        Products.findByIdAndUpdate(id, { $set: data}, { new: true }, function (err, doc) {
          if (err) {
            res.status(500).send({error: {message: err.message, info: err }})
            return
          }

          res.send(doc)
        })
      } else {
        product = new Products({
          title: data.title,
          description: data.description,
          mainImage: data.mainImage,
          secondImage: data.secondImage,
          category: data.category,
          number: data.number,
          price: data.price,
          discount: data.discount,
          isPublished: data.isPublished
        })

        await product.save((err, doc) => {
          if (err) {
            res.status(500).send({error: {message: err.message, info: err }})
            return
          }
          // saved!
          res.send({
            data: doc
          })
        })
      }

    } catch (err) {
      res.status(500).send({ error: { message: err.message, info: err }})
    }
  },
  /**
   *  DELETE /api/product/:id
   * */
  async removeProduct (req, res, next) {
    try {
      const {id} = req.params

      Products.findById(id, (err, doc) => {
        if (!doc || err) {
          res.status(500).send({ error: { message: 'Unable to remove the product.'}})
          return
        }

        doc.remove((err, doc) => {
          if (err) {
            res.status(500).send({ error: { message: 'Error occurred.'}})
            return
          }

          res.send({
            data: 'Product deleted successfully.'
          })
        });
      })
    } catch (err) {
      res.status(500).send({ error: { message: err.message, info: err }})
    }
  },
}
