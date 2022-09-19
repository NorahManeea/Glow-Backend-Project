import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // relation between order and user should be many orders to one user
  // here's 1to1 just for the demo
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
})

export default mongoose.model('Client', userSchema)
