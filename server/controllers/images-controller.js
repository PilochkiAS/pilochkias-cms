const axios = require('axios')
const Images = require('../models/images')
const { Types } = require('mongoose')
const ObjectId = Types.ObjectId;
const fs = require('fs')

module.exports = {
  /**
   *  GET /api/images
   *  To get only image info, not image buffer.
   * */
  async getImages (req, res, next) {
    const images = Images.find()

    images.select('title img.size _id createdAt')

    images.exec(async (err, docs) => {
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
   *  GET /api/image/:id
   * */
  async getImageById (req, res, next) {
    await Images.findOne({_id: ObjectId(req.params.id)}, function (err, doc) {
      if (err) {
        res.status(500).send({ error: {message: err.message, info: err }})
        return
      }

      res.contentType(doc.img.contentType)
      res.send(doc.img.data)
    })
  },
  /**
   *  POST /api/images
   * */
  async createImage (req, res, next) {
    try {
      const newImage = new Images({
        img: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          size: req.file.size
        },
        title: req.file.originalname
      })

      await newImage.save((err, doc) => {
        if (err) {
          res.status(500).send({error: {message: err.message, info: err }})
          return
        }

        res.send({
          data: doc._id,
          name: doc.title
        })
      })

    } catch (err) {
      res.status(500).send({ error: { message: err.message, info: err }})
    }
  },
  /**
   *  DELETE /api/image/:id
   * */
  async removeImage (req, res, next) {
    try {
      const {id} = req.params

      Images.findById(id, (err, doc) => {
        if (!doc || err) {
          res.status(500).send({ error: { message: 'Unable to remove the image.'}})
          return
        }

        doc.remove((err, doc) => {
          if (err) {
            res.status(500).send({ error: { message: 'Error occurred.'}})
            return
          }

          res.send({
            data: 'Product removed successfully.'
          })
        });
      })
    } catch (err) {
      res.status(500).send({ error: { message: err.message, info: err }})
    }
  },
}
