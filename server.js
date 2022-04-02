import { DB, PORT, SECRET, CERTIFICATE, PRIVATEKEY } from './config.js'
import https from 'https'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import cors from 'cors'
import { checkSchema } from 'express-validator'

import { prep, insert, allEmails } from './db.js'
allEmails()
//console.log(insert.exec())
//console.log('exec', prep.exec())
//console.log('obj', prep.step(), prep.get())
while (prep.step()) {
  console.log('obj', prep.get())
}

const api = express()

const server = https
  .createServer(
    {
      key: PRIVATEKEY,
      cert: CERTIFICATE
    },
    api
  )
  .listen(PORT, function () {
    console.log("Nothing much, what's up with you?")
  })

api.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-eval'",
          'https://unpkg.com/alpinejs',
          'https://cdn.tailwindcss.com'
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.tailwindcss.com'
        ]
      }
    }
  })
)

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

api.use(express.json())
api.use(express.static('public'))

api.use(function (req, res, next) {
  return res
    .status(404)
    .json({ success: false, message: 'Route ' + req.url + ' Not found.' })
})

api.use(function (error, req, res, next) {
  return res.status(500).json({ success: false, error: error.type })
})

const register = checkSchema({
  name: {
    in: ['params'],
    errorMessage: 'ID is wrong',
    notEmpty: {
      errorMessage: 'Password should be at least 7 chars long'
    },
    isAlpha: {
      errorMessage: 'Password should be at least 7 chars long'
    },
    isLength: {
      options: { min: 3, max: 64 }
    }
  },
  myCustomField: {
    // Custom validators
    custom: {
      options: (value, { req, location, path }) => {
        return value + req.body.foo + location + path
      }
    },
    // and sanitizers
    customSanitizer: {
      options: (value, { req, location, path }) => {
        let sanitizedValue

        if (req.body.foo && location && path) {
          sanitizedValue = parseInt(value)
        } else {
          sanitizedValue = 0
        }

        return sanitizedValue
      }
    }
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 7 chars long',
      // Multiple options would be expressed as an array
      options: { min: 7 }
    }
  },
  firstName: {
    isUppercase: {
      // To negate a validator
      negated: true
    },
    rtrim: {
      // Options as an array
      options: [[' ', '-']]
    }
  },
  // Support bail functionality in schemas
  email: {
    isEmail: {
      bail: true
    }
  },
  // Support if functionality in schemas
  someField: {
    isInt: {
      if: (value) => {
        return value !== ''
      }
    }
  },
  // Wildcards/dots for nested fields work as well
  'addresses.*.postalCode': {
    // Make this field optional when undefined or null
    optional: { options: { nullable: true } },
    isPostalCode: {
      options: 'US' // set postalCode locale here
    }
  }
})

api.post('/register', register, function (req, res) {
  res.json
})
