import { PORT, DB, SECRET, CERTIFICATE, PRIVATEKEY } from './config.js'
import https from 'https'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import accounts from './components/accounts/routes.js'

const api = express()

api.use(helmet())
api.use(cors())
api.use(
  session({
    name: 'whatsupdog',
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 1800000 }
  })
)

api.use(express.static('public'))

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

const server = https
  .createServer(
    {
      key: PRIVATEKEY,
      cert: CERTIFICATE
    },
    api
  )
  .listen(PORT, function () {
    mongoose.connect(DB, function () {
      console.log("Nothing much, what's up with you?")
    })
  })
