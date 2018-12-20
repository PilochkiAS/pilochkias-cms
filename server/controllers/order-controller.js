const axios = require('axios')
const Orders = require('../models/orders')
const { Types } = require('mongoose')
const onesignalApi = require('../api/onesignal-api')

const ObjectId = Types.ObjectId;

module.exports = {
  /**
   *  GET /api/orders
   * */
  async getOrders (req, res, next) {
    let orders = Orders.find()

    if (req.query.populate) await orders.populate('products.product')

    orders.exec(async (err, docs) => {
      if (err) {
        res.status(500).send({ error: { message: err.message, info: err }})
        return
      }

      res.send({
        data: docs
      })
    })
  },
  /**
   *  GET /api/order/:id
   * */
  async getOrderById (req, res, next) {

    await Orders.findOne({_id: ObjectId(req.params.id)}, function (err, doc) {
      if (err) {
        res.status(500).send({ error: { message: err.message, info: err }})
        return
      }

      res.send({
        data: doc
      })
    })
  },
  /**
   *  POST /api/orders
   *  --------OR---------
   *  PUT /api/order/:id
   * */
  async createOrUpdateOrder (req, res, next) {
    try {
      const { id } = req.params
      const data = req.body
      let order = {}

      if (id) {
        Orders.findByIdAndUpdate(id, { $set: data}, { new: true }, function (err, doc) {
          if (err) {
            res.status(500).send({error: {message: err.message, info: err }})
            return
          }
          res.send(doc)
        })
      } else {
        order = new Orders({
          products: data.products,
          customer: {
            fullName: data.customer.fullName,
            phone: data.customer.phone,
            address: data.customer.address,
            email: data.customer.email
          },
          engraving: data.engraving,
          isDone: false
        })

        await order.save((err, doc) => {
          if (err) {
            res.status(500).send({error: {message: err.message, info: err }})
            return
          }
          res.send({
            data: doc
          })
        })

        await onesignalApi.sendNotificationToAll({
          "en": "Someone made an order",
          "ru": "Кто-то сделал заказ"
        })
      }
    } catch (err) {
      res.status(500).send({ error: { message: err.message, info: err }})
    }
  },
  /**
   *  DELETE /api/order/:id
   * */
  async removeOrder (req, res, next) {
    try {
      const {id} = req.params

      Orders.findById(id, (err, doc) => {
        if (!doc || err) {
          res.status(500).send({ error: { message: 'Unable to remove the order.'}})
          return
        }

        doc.remove((err, doc) => {
          if (err) {
            res.status(500).send({ error: { message: 'Error occurred.'}})
            return
          }

          res.send({
            data: 'Order deleted successfully.'
          })
        });
      })

    } catch (err) {
      res.status(500).send({ error: { message: err.message, info: err }})
    }
  },
}
