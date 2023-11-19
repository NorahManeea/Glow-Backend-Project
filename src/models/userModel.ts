import mongoose from 'mongoose'


const userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

export default mongoose.model('Client', userSchema)
