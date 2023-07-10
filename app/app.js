import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { db } from './config/db.js'
import serviceRoutes from './routes/service.routes.js'
import authRoutes from './routes/auth.routes.js'
import appointmentRoutes from './routes/appointment.routes.js'
import userRoutes from './routes/user.routes.js'

dotenv.config()
db()

const app = express()

const whitelist = [process.env.FRONTEND_URL]

if (process.argv[2] === '--postman') {
  whitelist.push(undefined)
}

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

app.use(cors(corsOptions))

app.use(express.json())

app.use('/api/services', serviceRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/users', userRoutes)

export default app
