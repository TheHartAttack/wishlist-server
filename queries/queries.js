import {Item} from '../models/item.js'
import verifyToken from '../utils/verifyToken.js'
import * as cloudinary from 'cloudinary'
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
})

const apiStatus = (parent, args, context, info) => {
  return {status: 'The API is working correctly.'}
}

const items = async (parent, args, context, info) => {
  //Validate user token
  const tokenVerified = verifyToken(args.token)

  let items = []

  if (tokenVerified) {
    items = await Item.find().sort({order: 'asc'})
  } else {
    items = await Item.find({private: false})
  }

  return items
}

const item = async (parent, args, context, info) => {
  //Validate user token
  const tokenVerified = verifyToken(args.token)
  const item = await Item.findById(args.id)

  if (tokenVerified || !item.private) {
    return item
  } else {
    return null
  }
}

const signature = (parent, args, context, info) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request({timestamp: timestamp}, cloudinaryConfig.api_secret)
  return {timestamp, signature}
}

export {apiStatus, items, item, signature}
