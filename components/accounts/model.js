import mongoose from 'mongoose'
import { hash, compare } from './helpers.js'

const accountSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  email: {
    type: String,
    lowercase: true,
    index: { unique: true },
    required: [true, "You shoul'd privide an email address."],
    minlength: [
      1,
      "Your email address shoul'd be longer than five characters."
    ],
    maxlength: [
      50,
      "Your email address shoul'd be shorter than fifty characters."
    ],
    match: [/^\S+@\w+\.\w+$/, "You shoul'd privide a valid email address."],
    validate: {
      isAsync: true,
      validator: async function (email) {
        const result = await Account.findOne({ email })
        return !result
      },
      message: 'Your email has already been registered.'
    }
  },
  firstName: {
    type: String,
    required: [true, "You shoul'd privide a first name."],
    minlength: [1, "Your first name shoul'd be longer than one character."],
    maxlength: [
      50,
      "Your first name shoul'd be shorter than fifty characters."
    ],
    match: [/^[a-zA-Z]+$/, "Your first name shoul'd contain only letters."],
    capitalize: true
  },
  lastName: {
    type: String,
    required: [true, "You shoul'd provide a last name."],
    minlength: [1, "Your last name shoul'd be longer than one character."],
    maxlength: [50, "Your last name shoul'd be shorter than fifty characters."],
    match: [/^[a-zA-Z]+$/, "Your last name shoul'd contain only letters."],
    capitalize: true
  },
  hashedPassword: {
    type: String
    //required: true,
    //minlength: 60,
    //maxlength: 60,
    //match: /^[a-zA-Z\d\.\/\$]{60}$/
  },
  agreement: {
    type: Boolean,
    cast: "You shoul'd provide a boolean answer.",
    required: [true, "You shoul'd agree with the Terms and Agreement's."],
    validate: {
      validator: function (value) {
        return !!value
      },
      message: "You shoul'd agree with the Terms and Agreement's."
    }
  },
  admin: { type: Boolean, default: false },
  confirmed: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
  created: { type: Date, default: Date.now() },
  modified: { type: Date, default: Date.now() },
  virtual: {
    password: {
      type: String,
      alias: 'password',
      required: [true, "You shoul'd provide a password."],
      minlength: [8, "The password shoul'd be longer than eight characters."],
      maxlength: [
        64,
        "The password shoul'd be shorter than sixty four characters."
      ],
      match: [
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()\-_=+[{}\]\\|<,.>/?])([\w!@#$%^&*()\-_=+[{}\]\\|<,.>/?]){8,}$/,
        `The password shoul'd countain at least: one lowercase letter, one uppercase letter, one digit and one special character (!@#$%^&*()-_=+[{}]\|<,.>/?).`
      ]
    },
    confirmPassword: {
      type: String,
      alias: 'confirmPassword',
      required: [true, "You shoul'd confirm the password."],
      validate: {
        validator: function (value) {
          return this.password === value
        },
        message: "The passwords shoul'd match."
      }
    }
  }
})

accountSchema.methods.checkPassword = async function (password) {
  return await compare(password, this.hashedPassword)
}

accountSchema.pre('validate', async function () {
  this.hashedPassword = await hash(this.password)
})

const Account = mongoose.model('Account', accountSchema)

export default Account
