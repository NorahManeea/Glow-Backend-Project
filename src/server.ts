import express from 'express'

import usersRouter from './routers/users'
import productsRouter from './routers/products'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'

const app = express()
const PORT = 5050

app.use(myLogger)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)


app.use(apiErrorHandler)
app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
})
