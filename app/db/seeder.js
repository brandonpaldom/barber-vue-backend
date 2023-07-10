import dotenv from 'dotenv'
import colors from 'colors'
import { db } from '../config/db.js'
import Service from '../models/service.model.js'
import services from './services.js'

dotenv.config()
await db()

async function seedDatabase() {
  try {
    await Service.deleteMany()
    await Service.insertMany(services)
    console.log(colors.green('Database seeded!'))
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

async function clearDatabase() {
  try {
    await Service.deleteMany()
    console.log(colors.red('Database cleared!'))
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

if (process.argv[2] === '--import') {
  seedDatabase()
} else {
  clearDatabase()
}
