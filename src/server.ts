import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'

import usersRouter from './routers/usersRoute'
import authRouter from './routers/authRoute'
import categoryRouter from './routers/categoriesRoute'
import cartRouter from './routers/cartRoute'
import productsRouter from './routers/productsRoute'
import ordersRouter from './routers/ordersRoute'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import { databseConnection } from './database/db'

config()
const app = express()
const PORT = 5050

app.use(myLogger)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/products', productsRouter)

app.use(apiErrorHandler)

databseConnection()

app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
})
