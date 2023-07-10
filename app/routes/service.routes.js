import express from 'express'
import {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller.js'

const router = express.Router()

router.route('/').get(getServices).post(createService)
router
  .route('/:id')
  .get(getServiceById)
  .put(updateService)
  .delete(deleteService)

export default router
