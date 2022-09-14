import express from 'express'
const router = express.Router()

router.get('/', (_, res) => {
  res.json([
    {
      name: 'product 1',
    },
    {
      name: 'product 2',
    },
    {
      name: 'product 3',
    },
  ])
})

export default router
