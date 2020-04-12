import sha256 from 'sha256'
import User from '../models/User'

/**
 * Create a user with POST request data
 * @param request
 */
declare interface ICreateUser {
  email: string
  name: string
  password: string
  passwordVerification: string
  adult: boolean
}
export async function createUser (body: ICreateUser) {
  const { email, name, password, passwordVerification, adult } = body

  if (!email || !name || !password || !passwordVerification || !adult) {
    return 'Please fill data for user creation.'
  }

  if (password.trim() !== passwordVerification.trim()) return 'The password does not match.'

  const alreadyExists = await User.findOne({ $or: [{ name }, { email }] })
  if (alreadyExists) return 'A user with the same name or the same email is already existing.'

  const crypted = sha256.x2(password)
  const user = await User.create({ name, email, password: crypted, adult })

  if (!user) return 'An error has occured.'

  return 'The user has been added successfully.'
}

/**
 * Delete a user with POST request data
 * @param userId
 */
export async function deleteUser (userId: string) {
  try {
    const user = await User.findById(userId)

    if (!user) {
      const removed = await user?.remove()

      if (removed !== undefined) {
        return 'The user has been removed successfully.'
      } else {
        return 'An error has occured.'
      }
    }
  } catch (err) {
    return "There's no user with this identifier."
  }
}

/**
 *
 * @param userId
 */
export async function getUserById (userId: string) {
  try {
    const user = await User.findById(userId)
    user?.set('email', undefined)
    user?.set('password', undefined)
    user?.set('credits', undefined)

    return JSON.stringify(user)
  } catch (err) {
    return 'There is not user with that identifier.'
  }
}

/**
 *
 * @param email
 * @param password
 */
export async function login (email: string, password: string) {
  // should be finished with token generation
  // and more security
  try {
    const user = await User.findOne({ email })
    const crypted = sha256.x2(password)

    // @ts-ignore
    if (user.password === crypted) {
      return 'Logged success.'
    } else {
      return 'Password does not match.'
    }
  } catch (err) {
    return 'This user does not exists in our database.'
  }
}
