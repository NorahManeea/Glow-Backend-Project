import { sendEmail } from "../utils/sendEmail"

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