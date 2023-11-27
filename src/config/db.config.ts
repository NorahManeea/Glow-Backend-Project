import 'dotenv/config'

export const dbConfig = {
  db: {
    url: process.env.ATLAS_URL || '',
  },
}
