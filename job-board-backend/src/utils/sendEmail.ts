import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"Job Board" <${process.env.GMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  })
}

export default sendEmail