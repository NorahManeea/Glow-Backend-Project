import 'dotenv/config'

export const emailConfig = {
  emailAddress: process.env.EMAIL_ADDRESS || 'blacktigers.btteam@gmail.com',
  emailPassword: process.env.EMAIL_PASSWORD || 'secret',
}
