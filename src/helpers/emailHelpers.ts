import { OrderDocument, ProductDocument } from '../types/types'
import { sendEmail } from '../utils/sendEmailUtils'

export const sendActivationEmail = async (email: string, name: string, activationLink: string) => {
  const subject = 'Welcome to Glow, Activate Your Account Now!'
  const htmlTemplate = `
      <div style="background-color: #F7F7F7; padding: 90px;">
      <div style="background-color: #ffffff; border-top: 3px solid #F2ACAA; text-align: center; padding: 5px;">
        <p style="color: #956556; font-weight: bold; margin-top: 6px">GLOW</p>
        <p style="color: #F2ACAA; font-weight: 500;">Hi ${name},</p>
        <p style="color: #606060;">Welcome to Glow! We're thrilled to have you on board. To get started and unlock the full Glow experience, please take a moment to activate your account.
        </p>
        <p style="color: #606060;">Please click the following button to do so.</p>
        <a href="${activationLink}" style="display: inline-block; background-color: #956556; color: #ffffff; text-decoration: none; padding: 10px 25px; margin-top: 20px; border-radius: 5px;">Activate Account </a>
        <p style="color: #606060;">Cheers,<br>The Glow Team</p>
      </div>
    </div>
    `
  const isSent = await sendEmail(email,name, subject, htmlTemplate)
  return isSent
}

export const sendResetPasswordEmail = async (email: string, name: string, resetLink: string) => {
  const subject = 'Glow Password Reset'
  const htmlTemplate = `
  <div style="background-color: #F7F7F7; padding: 90px;">
  <div style="background-color: #ffffff; border-top: 3px solid #F2ACAA; text-align: center; padding: 5px;">
    <p style="color: #956556; font-weight: bold; margin-top: 6px">GLOW</p>
    <p style="color: #F2ACAA; font-weight: 500;">Hi ${name},</p>
    <p style="color: #606060;">Looks like you'd like to change your Glow password. Please click the following button to do so.</p>
    <p style="color: #606060;">Please disregard this e-mail if you did not request a password reset.</p>
    <a href="${resetLink}" style="display: inline-block; background-color: #956556; color: #ffffff; text-decoration: none; padding: 10px 25px; margin-top: 20px; border-radius: 5px;">Set Password</a>
    <p style="color: #606060;">Cheers,<br>The Glow Team</p>
  </div>
</div>
  `
  return await sendEmail(email, name, subject, htmlTemplate)
}

export const sendOrderConfirmationEmail = async (email: string,  name: string) => {
  const subject = 'Thank You for Your Order with Glow'
  const htmlTemplate = `
  <div style="background-color: #F7F7F7; padding: 90px;">
  <div style="background-color: #ffffff; border-top: 3px solid #F2ACAA; text-align: center; padding: 5px;">
    <p style="color: #956556; font-weight: bold; margin-top: 6px">GLOW</p>
    <p style="color: #F2ACAA; font-weight: 500;">Hi ${name},</p>
    <p style="color: #606060;">Thank you for choosing Glow! We're excited to confirm that we've received your order.</p>
    <p style="color: #606060; text-align: center; margin-top: 20px; padding: 30px">Your order is now being processed, and we'll notify you once it's shipped. If you have any questions or need further assistance, feel free to reach out to our customer support team.</p>

    <p style="color: #606060;">Cheers,<br>The Glow Team</p>
  </div>
</div>

      `
  return await sendEmail(email,name, subject, htmlTemplate)
}
