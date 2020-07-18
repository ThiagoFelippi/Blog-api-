import jwt from 'jsonwebtoken'

export const generateToken = (payload = {}) => {
  const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn: 1000 * 60 * 60 * 24 * 2
  })
  return token
}