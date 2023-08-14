import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {User} from '../models/user.js'
import {Item} from '../models/item.js'
import verifyToken from '../utils/verifyToken.js'
import * as cloudinary from 'cloudinary'
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
})

const loginUser = async (parent, args, context, info) => {
  //Get user
  const user = await User.findOne({username: args.username.toLowerCase()})

  //Check user exists
  if (!user) {
    return {
      token: null,
      errors: ['User not found.']
    }
  }

  //Check password is correct
  if (!bcrypt.compareSync(args.password, user.password)) {
    return {
      token: null,
      errors: ['Incorrect password.']
    }
  }

  //Return token
  return {
    token: jwt.sign({username: user.username}, process.env.JWT_SECRET, {expiresIn: '365d'}),
    errors: []
  }
}

const addItem = async (parent, args, context, info) => {
  try {
    //Validate user token
    const tokenVerified = verifyToken(args.token)

    if (!tokenVerified) {
      return {
        item: {},
        errors: ['Invalid token.']
      }
    }

    //Validate image
    if (args.image.public_id) {
      const expectedSignature = cloudinary.utils.api_sign_request({public_id: args.image.public_id, version: args.image.version}, cloudinaryConfig.api_secret)
      if (expectedSignature != args.image.signature) {
        return {
          item: {},
          errors: ['The cloudinary signature is invalid.']
        }
      }
    }

    const item = new Item({
      name: args.name,
      price: args.price,
      notes: args.notes,
      link: args.link,
      image: args.image.public_id,
      private: args.private,
      order: 0
    })

    const savedItem = await item.save()

    await Item.updateMany({_id: {$ne: savedItem._id}}, {$inc: {order: 1}})

    return {
      item: savedItem,
      errors: []
    }
  } catch (e) {
    return {
      item: null,
      errors: [e.message]
    }
  }
}

const deleteItem = async (parent, args, context, info) => {
  try {
    //Validate user token
    const tokenVerified = verifyToken(args.token)

    if (!tokenVerified) {
      return {
        item: {},
        errors: ['Invalid token.']
      }
    }

    const item = await Item.findById(args.id)

    await Item.updateMany({_id: {$ne: item._id}, order: {$gt: item.order}}, {$inc: {order: -1}})

    //Delete image from Cloudinary
    if (item.image) {
      cloudinary.uploader.destroy(item.image)
    }

    const deletedItem = await Item.findByIdAndRemove(args.id)

    return {
      item: deletedItem,
      errors: []
    }
  } catch (e) {
    return {
      item: null,
      errors: [e.message]
    }
  }
}

const editItem = async (parent, args, context, info) => {
  try {
    //Validate user token
    const tokenVerified = verifyToken(args.token)

    if (!tokenVerified) {
      return {
        item: {},
        errors: ['Invalid token.']
      }
    }

    //Validate image
    if (args.image.public_id) {
      const expectedSignature = cloudinary.utils.api_sign_request({public_id: args.image.public_id, version: args.image.version}, cloudinaryConfig.api_secret)
      if (expectedSignature != args.image.signature) {
        return {
          item: {},
          errors: ['The cloudinary signature is invalid.']
        }
      }
    }

    //Remove old image
    if (args.imageUpdated) {
      const item = await Item.findById(args.id)
      cloudinary.uploader.destroy(item.image)
    }

    //Update object
    const data = {
      name: args.name,
      price: args.price,
      notes: args.notes,
      link: args.link,
      private: args.private
    }

    if (args.imageUpdated) {
      data.image = args.image.public_id ? args.image.public_id : null
    }

    const updatedItem = await Item.findByIdAndUpdate(args.id, data, {new: true})

    return {
      item: updatedItem,
      errors: []
    }
  } catch (e) {
    return {
      item: null,
      errors: [e.message]
    }
  }
}

const updateOrder = async (parent, args, context, info) => {
  try {
    args.items.forEach(async (itemID, index) => {
      const item = await Item.findByIdAndUpdate(itemID, {order: index})
    })

    return {
      success: true
    }
  } catch (e) {
    return {
      success: false
    }
  }
}

export {loginUser, addItem, deleteItem, editItem, updateOrder}
