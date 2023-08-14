import {model, Schema} from 'mongoose'

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {unique: true}
  },
  email: {
    type: String,
    required: true,
    index: {unique: true}
  },
  password: {
    type: String,
    required: true
  },
  token: String
})

export const User = model('User', userSchema)
