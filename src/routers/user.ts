import express from 'express'
const router = express.Router()

const users = [
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
    user: users,
  })
})

router.get('/:userId', (req, res) => {
  const userId = req.params.userId
  console.log('userId:', userId)
  const user = users.find((user) => user.id === Number(userId))
  console.log('user:', user)
  if (user) {
    res.json({
      status: 200,
      user,
    })
  }
})

router.post('/', (req, res) => {
  const user = req.body
  console.log('user:', user)

  res.json({
    message: 'done',
    user
  })
})

router.put('/', (req, res) => {
  res.send('/user PUT request')
})

router.delete('/', (req, res) => {
  res.send('/user DELETE request')
})

export default router
