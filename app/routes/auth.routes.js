import express from 'express'
import {
  register,
  verify,
  login,
  user,
  admin,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
} from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/register').post(register)
router.route('/verify/:token').get(verify)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router
  .route('/forgot-password/:token')
  .get(verifyResetPasswordToken)
  .post(resetPassword)

router.route('/user').get(authMiddleware, user)
router.route('/admin').get(authMiddleware, admin)

export default router
