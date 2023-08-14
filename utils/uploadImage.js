import {createWriteStream} from 'fs'
import path from 'path'
import sharp from 'sharp'
const transform = sharp()
transform.resize(400, 480)

const uploadImage = image => {
  return new Promise(async (resolve, reject) => {
    if (image.mimetype != 'image/jpeg' && image.mimetype != 'image/jpg' && image.mimetype != 'image/png') {
      reject('Invalid file type.')
    }

    const imageParse = path.parse(image.filename)
    const filename = `${Date.now().toString()}${imageParse.ext}`

    image
      .createReadStream()
      .pipe(transform)
      .pipe(createWriteStream(`./public/${filename}`))
      .on('finish', () => {
        resolve(filename)
      })
      .on('error', error => {
        reject(error)
      })
  })
}

export default uploadImage
