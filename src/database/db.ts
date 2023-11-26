import mongoose from 'mongoose'

import { dbConfig } from '../config/db.config'

const URL = dbConfig.db.url

export const databseConnection = () => {
  mongoose
    .connect(URL)
    .then(() => {
      console.log('Database connected')
    })
    .catch((err) => {
      console.log('MongoDB connection error, ', err)
    })
}
