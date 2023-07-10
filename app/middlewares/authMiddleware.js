import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization) {
    return res.status(401).json({
      error: 'Invalid token',
    })
  }

  const token = authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      error: 'Invalid token',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select(
      '-password -verified -token -__v'
    )

    next()
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
    })
  }
}

export default authMiddleware
