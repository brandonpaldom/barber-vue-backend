import { createTransport } from '../config/nodemailer.js'

export async function sendVerificationEmail({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email',
    html: `
      <div>
        <h1>Hi ${name}</h1>
        <p>Thanks for registering!</p>
        <p>Please verify your email by clicking the link below</p>
        <a href="${process.env.FRONTEND_URL}/auth/verify/${token}">Verify your email</a>
        <p>If you did not register, please ignore this email</p>
      </div>
    `,
  })

  console.log('Message sent: %s', info.messageId)
}

export async function sendResetPasswordEmail({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <div>
        <h1>Hi ${name}</h1>
        <p>You are receiving this email because you requested to reset your password</p>
        <p>Please reset your password by clicking the link below</p>
        <a href="${process.env.FRONTEND_URL}/auth/reset-password/${token}">Reset your password</a>
        <p>If you did not request to reset your password, please ignore this email</p>
      </div>
    `,
  })

  console.log('Message sent: %s', info.messageId)
}
