import 'dotenv/config'

  export const paymentConfig = {
    stripe: process.env.STRIPE_SECRET_KEY || ''
  }
