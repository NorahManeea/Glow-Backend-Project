import express from 'express'
const router = express.Router()

const prodcuts = [
  {
    id: 1,
    user: '1',
  },
  {
    id: 2,
    user: '2',
  },
  {
    id: 3,
    user: '3',
  },
]

router.get('/', (req, res) => {
  res.json({
    status: 200,
    user: prodcuts,
  })
})


export default router
