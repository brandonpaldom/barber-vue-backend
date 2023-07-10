import { createTransport } from '../config/nodemailer.js'

export async function sendAppointmentsEmail({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
    to: 'admin@mail.com',
    subject: 'New appointment',
    html: `
      <div>
        <h1>New appointment</h1>
        <p>There is a new appointment</p>
        <p>Date: ${date}</p>
        <p>Time: ${time}</p>
      </div>
    `,
  })

  console.log('Message sent: %s', info.messageId)
}

export async function updateAppointmentsEmail({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
    to: 'admin@mail.com',
    subject: 'Update appointment',
    html: `
      <div>
        <h1>Update appointment</h1>
        <p>There is an update appointment</p>
        <p>Date: ${date}</p>
        <p>Time: ${time}</p>
      </div>
    `,
  })

  console.log('Message sent: %s', info.messageId)
}

export async function deleteAppointmentsEmail({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
    to: 'admin@mail.com',
    subject: 'Delete appointment',
    html: `
      <div>
        <h1>Delete appointment</h1>
        <p>There is a delete appointment</p>
        <p>Date: ${date}</p>
        <p>Time: ${time}</p>
      </div>
    `,
  })

  console.log('Message sent: %s', info.messageId)
}
