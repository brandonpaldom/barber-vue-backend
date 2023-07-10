import mongoose from 'mongoose'
import colors from 'colors'

export async function db() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        'MongoDB connection URI not found in environment variables'
      )
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    const dbConnection = await mongoose.connect(process.env.MONGO_URI, options)

    dbConnection.connection.on('error', (error) => {
      console.log(colors.red('MongoDB connection error:', error))
    })

    dbConnection.connection.on('disconnected', () => {
      console.log(colors.red('MongoDB disconnected'))
    })

    console.log(
      colors.green(`MongoDB connected: ${dbConnection.connection.host}`)
    )
    return dbConnection
  } catch (error) {
    console.log(colors.red('Failed to connect to MongoDB', error))
    process.exit(1)
  }
}
