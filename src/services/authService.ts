import { User } from '../models/userModel'

// @service:- Register a User
export const checkIfUserExistsByEmail = async (email: string) => {
  const userEmail = await User.findOne({ email })
  return userEmail
}

//  @service:- Activate a User
export const activate = async (activationToken: string) => {
  const user = await User.findOneAndUpdate(
    { activationToken },
    { isAccountVerified: true, token: undefined },
    { new: true }
  )
  return user
}
