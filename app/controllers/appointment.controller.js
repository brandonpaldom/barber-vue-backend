import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns'
import Appointment from '../models/appointment.model.js'
import { validateObjectId, handleNotFoundErrors } from '../utils/index.js'
import {
  sendAppointmentsEmail,
  updateAppointmentsEmail,
  deleteAppointmentsEmail,
} from '../emails/appointmentsService.js'
import { parseDate } from '../utils/index.js'

export async function createAppointment(req, res) {
  const appointment = req.body
  appointment.user = req.user._id.toString()
  try {
    const newAppointment = new Appointment(appointment)
    const savedAppointment = await newAppointment.save()
    await sendAppointmentsEmail({
      date: parseDate(savedAppointment.date),
      time: savedAppointment.time,
    })
    res.status(201).json({
      message: 'Appointment created successfully',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getAppointmentsByDate(req, res) {
  const { date } = req.query
  const parsedDate = parse(date, 'dd/MM/yyyy', new Date())
  if (!isValid(parsedDate)) {
    return res.status(400).json({ error: 'Invalid date' })
  }
  const isoDate = formatISO(parsedDate)
  try {
    const appointments = await Appointment.find({
      date: {
        $gte: startOfDay(new Date(isoDate)),
        $lte: endOfDay(new Date(isoDate)),
      },
    }).select('time')

    res.status(200).json(appointments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getAppointmentById(req, res) {
  const { id } = req.params
  if (validateObjectId(id, res)) return
  try {
    const appointment = await Appointment.findById(id).populate('services')
    if (!appointment) {
      return handleNotFoundErrors('Appointment not found', res)
    }
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateAppointment(req, res) {
  const { id } = req.params
  if (validateObjectId(id, res)) return
  const appointment = await Appointment.findById(id).populate('services')
  if (!appointment) {
    return handleNotFoundErrors('Appointment not found', res)
  }
  if (appointment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  const { services, date, time, totalPrice } = req.body
  appointment.services = services
  appointment.date = date
  appointment.time = time
  appointment.totalPrice = totalPrice
  try {
    await appointment.save()
    await updateAppointmentsEmail({
      date: parseDate(appointment.date),
      time: appointment.time,
    })
    res.status(200).json({ message: 'Appointment updated successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteAppointment(req, res) {
  const { id } = req.params
  if (validateObjectId(id, res)) return
  const appointment = await Appointment.findById(id).populate('services')
  if (!appointment) {
    return handleNotFoundErrors('Appointment not found', res)
  }
  if (appointment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  try {
    await appointment.deleteOne()
    await deleteAppointmentsEmail({
      date: parseDate(appointment.date),
      time: appointment.time,
    })
    res.status(200).json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
