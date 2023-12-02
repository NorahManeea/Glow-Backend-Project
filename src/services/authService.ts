import { User } from '../models/userModel'
import { UserDocument } from '../types/types'

//** Service:- Check User email */
export const checkIfUserExistsByEmail = async (email: string) => {
  const userEmail = await User.findOne({ email })
  return userEmail
}

//** Service:- Activate a User */
export const activate = async (activationToken: string) => {
  const user = await User.findOneAndUpdate(
    { activationToken },
    { isAccountVerified: true, token: undefined },
    { new: true }
  )
  return user
}

//** Service:- Create a User */
export const createUser = async (user: UserDocument) => {
  const newUser = await User.create(user)
  return newUser
}
