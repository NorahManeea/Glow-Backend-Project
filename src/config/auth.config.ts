import 'dotenv/config'

export const authConfig = {
  jwt: {
    accessToken: process.env.JWT_SECRET || 'secret',
  },
}
