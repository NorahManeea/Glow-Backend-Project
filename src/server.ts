import express from 'express'

import usersRouter from './routers/users'
import productsRouter from './routers/products'

const app = express()
const PORT = 5050

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  '/api/users',
  (req, res, next) => {
    const isAdmin = req.body.isAdmin

    if (!isAdmin) {
      return res.status(403).json({
        msg: 'IT IS PROTECTED',
      })
    }
    next()
  },
  usersRouter
)

app.use('/api/products', productsRouter)

app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
})
