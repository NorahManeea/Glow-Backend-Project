import nodemailer from 'nodemailer'
import { emailConfig } from '../config/email.config'
import crypto from 'crypto'


export function generateActivationToken() {
  return crypto.randomBytes(32).toString('hex')
}


export const sendEmail = async (email: string, subject: string, htmlTemplate: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.emailAddress,
        pass: emailConfig.emailPassword,
      },
    })

    const mailOptions = {
      from: emailConfig.emailAddress,
      to: email,
      subject: subject,
      html: htmlTemplate,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Test The Email: ' + info.response)
  } catch (error) {
    console.log(error)
    throw new Error('Nodemailer Error')
  }
}
