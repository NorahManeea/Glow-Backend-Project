import express from 'express'

import myLogger from './middlewares/logger'
import error from './middlewares/errorHandler'
import userRouter from './routers/user'
import productsRouter from './routers/products'

const app = express()
const port = 5050
// Global middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(myLogger)

// Routers
app.use('/users', userRouter)
app.use('/products', productsRouter)


// Error handling middleware
app.use(error.errorHandler404)
app.use(error.globalErrorHandler)

app.listen(port, () => console.log(`App is listening on port ${port}`))
