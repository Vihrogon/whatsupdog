import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import accounts from './components/accounts/routes.js'

const api = express()

api.use(helmet())
api.use(cors())

api.use(express.json())

api.use(accounts)

api.use(function (req, res, next) {
  return res
    .status(404)
    .json({ success: false, message: 'Route ' + req.url + ' Not found.' })
})
api.use(function (error, req, res, next) {
  return res.status(500).json({ success: false, error: error.type })
})

api.listen(
  process.env.PORT || 3000,
  process.env.HOST || 'localhost',
  function () {
    mongoose.connect(process.env.DB, function () {
      console.log("Nothing much, what's up with you?")
    })
  }
)
