import jwt from 'jsonwebtoken'

function verifyToken(token = '') {
  try {
    jwt.verify(token, process.env.JWT_SECRET)
    return true
  } catch (e) {
    console.log(e.message)
    return false
  }
}

export default verifyToken
