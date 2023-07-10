import app from './app/app.js'
import colors from 'colors'

const port = process.env.PORT || 3000

app.listen(port, () => {
  // console.log(`Server running on port ${port}`)
  console.log(colors.blue(`Server running on port ${port}`))
})
