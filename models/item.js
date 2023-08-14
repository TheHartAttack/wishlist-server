import {model, Schema} from 'mongoose'

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    min: 0
  },
  notes: String,
  link: String,
  image: String,
  order: {
    type: Number,
    min: 0
  },
  private: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  }
})

export const Item = model('Item', itemSchema)
