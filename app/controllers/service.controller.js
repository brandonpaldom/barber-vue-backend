import Service from '../models/service.model.js'
import { validateObjectId, handleNotFoundErrors } from '../utils/index.js'

export async function createService(req, res) {
  if (Object.values(req.body).includes('')) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const service = new Service(req.body)
    await service.save()
    res.status(201).json(service)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getServices(req, res) {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getServiceById(req, res) {
  const { id } = req.params
  if (validateObjectId(id, res)) return
  try {
    const service = await Service.findById(id)
    if (!service) {
      return handleNotFoundErrors('Service not found', res)
    }
    res.json(service)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateService(req, res) {
  const { id } = req.params
  if (validateObjectId(id, res)) return
  try {
    const service = await Service.findById(id)
    if (!service) {
      return handleNotFoundErrors('Service not found', res)
    }
    Object.assign(service, req.body)
    await service.save()
    res.json(service)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteService(req, res) {
  const { id } = req.params
  if (validateObjectId(id, res)) return
  try {
    const service = await Service.findById(id)
    if (!service) {
      return handleNotFoundErrors('Service not found', res)
    }
    await service.deleteOne()
    res.json({ message: 'Service deleted' })
  } catch (error) {
    console.log(error)
  }
}
