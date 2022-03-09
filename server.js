import 'dotenv/config'
import fs from 'fs'
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
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 1800000 }
  })
)

api.use(express.json())
api.use(accounts)

api.get('/', function (req, res) {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Whatsupdog</title>
    </head>
    <body>
      
    </body>
    </html>
  `)
})

api.use(function (req, res, next) {
  return res
    .status(404)
    .json({ success: false, message: 'Route ' + req.url + ' Not found.' })
})
api.use(function (error, req, res, next) {
  return res.status(500).json({ success: false, error: error.type })
})

const serverOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}

const server = https.createServer(serverOptions, api)

server.listen(
  process.env.PORT || 3000,
  function () {
    mongoose.connect(process.env.DB, function () {
      console.log("Nothing much, what's up with you?")
    })
  }
)
