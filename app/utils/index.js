import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { format } from 'date-fns'
import en from 'date-fns/locale/en-US/index.js'

export const validateObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid object id' })
  }
}

export const handleNotFoundErrors = (message, res) => {
  return res.status(404).json({ error: message })
}

export const uniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(32).substring(2)
}

export const generateJwtToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  return token
}

export const parseDate = (date) => {
  return format(date, 'PPPP', { locale: en })
}
