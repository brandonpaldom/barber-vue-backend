import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { getUserAppointments } from '../controllers/user.controller.js'

const router = express.Router()

router.route('/:user/appointments').get(authMiddleware, getUserAppointments)

export default router
