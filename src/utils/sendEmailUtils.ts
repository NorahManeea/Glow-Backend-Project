import nodemailer from 'nodemailer'
import crypto from 'crypto'

import { emailConfig } from '../config/email.config'

//** Generate Activation Token */
export function generateActivationToken() {
  return crypto.randomBytes(32).toString('hex')
}

//** Send Email Function */
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
    return true
  } catch (error) {
    throw new Error('Nodemailer Error')
  }
}
