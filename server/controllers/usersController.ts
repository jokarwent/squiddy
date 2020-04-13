import sha256 from 'sha256'
import User from '../models/User'
import { handleError } from './errorsController'

declare interface ICreateUser {
  email: string
  name: string
  password: string
  passwordVerification: string
  adult: boolean
}

/**
 * Create a user with POST request data
 * @param request ICreateUser
 */
export async function createUser (body: ICreateUser) {
  const { email, name, password, passwordVerification, adult } = body

  if (!email || !name || !password || !passwordVerification) return handleError({ type: 400, message: 'Please fill data for user creation.' })
  if (password.trim() !== passwordVerification.trim()) return handleError({ type: 400, message: 'The password does not match.' })

  const alreadyExists = await User.findOne({ $or: [{ email }, { name }] })
  if (alreadyExists) return handleError({ type: 400, message: 'A user with the name name/email is already existing.' })

  /* need to use bcrypt later */
  const crypted = sha256.x2(password)
  const user = await User.create({ name, email, password: crypted, adult })

  if (!user) return handleError({ type: 400, message: 'An error has occured.' })

  return handleError({ type: 201, message: 'User has been added successfully.' })
}

/**
 * Delete a user with POST request data
 *
 * Shouldn't remove an user, but changing his data for
 * sounds uploaded or maybe do a user purge at deletion?
 * @param userId string
 */
export async function deleteUser (userId: string) {
  try {
    const user = await User.findById(userId)
    if (!user) return handleError({ type: 400, message: 'There is no user with this identifier, aborting.' })

    const removed = user?.remove()
    if (!removed) return handleError({ type: 400, message: 'An error has occured.' })

    return handleError({ type: 200, message: 'User has been deleted successfully.' })
  } catch {
    return handleError({ type: 404, message: 'There is no user with this identifier, aborting.' })
  }
}

/**
 *
 * @param userId
 */
export async function getUserById (userId: string) {
  try {
    const user = await User.findById(userId)
    if (!user) return handleError({ type: 400, message: 'An error has occured.' })

    user.set('email', undefined)
    user.set('password', undefined)
    user.set('credits', undefined)

    return handleError({ type: 200, message: JSON.stringify(user) })
  } catch (err) {
    return handleError({ type: 404, message: 'There is no user with this identifier, aborting.' })
  }
}

/**
 *
 * @param email
 * @param password
 */
export async function login ({ email, password } : { email : string, password : string }) {
  try {
    const user = await User.findOne({ email })
    if (!user) return handleError({ type: 404, message: 'There is no user found with this email, aborting.' })

    // should be finished with token generation
    // and more security and should use bcrypt!
    // instead "sha256"
    const crypted = sha256.x2(password)

    // @ts-ignore
    if (user.password === crypted) {
      return handleError({ type: 200, message: 'Login success.' })
    } else {
      return handleError({ type: 400, message: 'Password does not match.' })
    }
  } catch (err) {
    return handleError({ type: 404, message: 'There is no user found with this email, aborting.' })
  }
}
