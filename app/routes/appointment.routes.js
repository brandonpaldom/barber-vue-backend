import express from 'express'
import {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .get(authMiddleware, getAppointmentsByDate)
  .post(authMiddleware, createAppointment)

router
  .route('/:id')
  .get(authMiddleware, getAppointmentById)
  .put(authMiddleware, updateAppointment)
  .delete(authMiddleware, deleteAppointment)

export default router
