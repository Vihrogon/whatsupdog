import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    minlength: 5,
    maxlength: 50,
    match: /^\S+@\w+\.\w+$/
  },
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    capitalize: true,
    match: /^\w+$/
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    match: /^\w+$/
  },
  rawPassword: {
    type: String,
    minlength: 8,
    maxlength: 64,
    match:
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()\-_=+[{}\]\\|<,.>/?])([\w!@#$%^&*()\-_=+[{}\]\\|<,.>/?]){8,}$/
  },
  hashedPassword: {
    type: String,
    required: true,
    minlength: 60,
    maxlength: 60,
    match: /^[a-zA-Z\d\.\/\$]{60}$/
  },
  agreement: { type: Boolean, required: true },
  confirmed: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  created: { type: Date, default: Date.now() },
  modified: { type: Date, default: Date.now() }
})

const Account = mongoose.model('Account', accountSchema)

export default Account
