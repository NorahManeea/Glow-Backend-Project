import { sendEmail } from '../utils/sendEmailUtils'

export const sendActivationEmail = async (email: string, activationLink: string) => {
  const subject = 'Welcome to Black Tigers Team!'
  const htmlTemplate = `
      <div style="color: #333; text-align: center;">
        <h1 style="color: #1E1E1E;">Welcome to Black Tigers Team!</h1>
        <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #664971; color: #FFFFFF; font-size: 18px; text-decoration: none; border-radius: 5px;">Activate Now</a>
        <p style="font-size: 14px; color: #302B2E;">Black Tigers Team</p>
      </div>
    `
  const isSent = await sendEmail(email, subject, htmlTemplate)
  return isSent
}

export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  const subject = 'Reset Your Password'
  const htmlTemplate = `
    <p>Click the following button to reset your password:</p>
    <a href="${resetLink}">
      <button style="display: inline-block; padding: 10px 20px; background-color: #664971; color: #FFFFFF; font-size: 18px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </button>
    </a>
  `
  return await sendEmail(email, subject, htmlTemplate)
}

export const sendOrderConfirmationEmail = async (email: string) => {
  const subject = 'We have received your order'
  const htmlTemplate = `
        <div style="color: #333; text-align: center;">
          <h1 style="color: #1E1E1E;">Thanks for your purchase</h1>
          <p>We'll prepare your order for immediate dispatch and you will recive it shortly. We'll email you the shiping confirmation once your order is on its way.</p>
          <p style="font-size: 14px; color: #302B2E;">Black Tigers Team</p>
        </div>
      `
  return await sendEmail(email, subject, htmlTemplate)
}
