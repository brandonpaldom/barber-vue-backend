import User from '../models/user.model.js'
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from '../emails/authEmailService.js'
import { generateJwtToken, uniqueId } from '../utils/index.js'

export async function register(req, res) {
  if (Object.values(req.body).includes('')) {
    return res.status(400).json({
      error: 'Missing required fields',
    })
  }

  const { email, password } = req.body
  const userExist = await User.findOne({ email })

  if (userExist) {
    return res.status(400).json({
      error: 'User already exists',
    })
  }

  if (password.trim().length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long',
    })
  }

  try {
    const user = new User(req.body)
    const savedUser = await user.save()
    const { name, email, token } = savedUser
    sendVerificationEmail({ name, email, token })

    res.status(202).json({
      message: 'User created successfully, please verify your email',
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export async function verify(req, res) {
  const { token } = req.params
  const user = await User.findOne({ token })

  if (!user) {
    return res.status(400).json({
      error: 'Invalid token',
    })
  }

  try {
    user.verified = true
    user.token = ''
    await user.save()

    res.status(200).json({
      message: 'User verified successfully',
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({
      error: 'User does not exist',
    })
  }

  if (!user.verified) {
    return res.status(400).json({
      error: 'You must verify your email before logging in',
    })
  }

  if (await user.comparePassword(password)) {
    const token = generateJwtToken(user._id)

    return res.status(200).json({
      token,
    })
  } else {
    return res.status(400).json({
      error: 'Invalid password',
    })
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({
      error: 'User does not exist',
    })
  }

  try {
    const token = uniqueId()
    user.token = token
    await user.save()
    await sendResetPasswordEmail({ name: user.name, email, token })

    res.status(200).json({
      message: 'Token generated successfully, please check your email',
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export async function verifyResetPasswordToken(req, res) {
  const { token } = req.params
  const validToken = await User.findOne({ token })

  if (!validToken) {
    return res.status(400).json({
      error: 'Invalid token',
    })
  }

  res.status(200).json({
    message: 'Token verified successfully',
  })
}

export async function resetPassword(req, res) {
  const { token } = req.params
  const user = await User.findOne({ token })

  if (!user) {
    return res.status(400).json({
      error: 'Invalid token',
    })
  }

  const { password } = req.body

  try {
    user.token = ''
    user.password = password
    await user.save()

    res.status(200).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}

export async function user(req, res) {
  const { user } = req

  if (!user._id) {
    return res.status(400).json({
      error: 'User does not exist',
    })
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    admin: user.admin,
  })
}

export async function admin(req, res) {
  const { user } = req

  if (!user.admin) {
    return res.status(403).json({
      error: 'You are not authorized to access this route',
    })
  }

  res.status(200).json(user)
}
