import express from 'express'
import { config } from 'dotenv'

import usersRouter from './routers/usersRoute'
import authRouter from './routers/authRoute'
import categoryRouter from './routers/categoriesRoute'
import cartRouter from './routers/cartRoute'
import productsRouter from './routers/productsRoute'
import wishListRouter from './routers/wishListRoute'
import discountCodeRouter from './routers/discountCodeRoute'
import passwordRouter from './routers/passwordRoute'
import ordersRouter from './routers/ordersRoute'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import { databaseConnection } from './database/db'

config()
const app = express()
const PORT = 5050

app.use(myLogger)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/wishlist', wishListRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/reset-password', passwordRouter)
app.use('/api/products', productsRouter)
app.use('/api/discount-code', discountCodeRouter)

app.use(apiErrorHandler)

databaseConnection()

app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
})
