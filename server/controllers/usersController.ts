import User from '../models/User'

export async function createUser (request: object) {
  if (JSON.stringify(request) !== '{}') {
    // @ts-ignore
    const { email, name, password, passwordVerification, adult } = request
    let isExisting =
      (await User.exists({ name })) || (await User.exists({ email }))

    if (!isExisting) {
      if (password === passwordVerification) {
        let user = await User.create({ name, email, password, adult })
        let saved = await user.save()

        if (saved !== undefined) {
          return 'The user has been added successfully.'
        } else {
          return 'An error has occured.'
        }
      } else {
        return 'The password does not match.'
      }
    } else {
      return 'A user with the same name or the same email is already existing.'
    }
  } else {
    return 'Please fill data for user creation.'
  }
}

export async function deleteUser (userId: string) {
  try {
    let user = await User.findById(userId)

    if (user !== undefined) {
      let removed = await user?.remove()

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

export async function getUserById (userId: string) {
  try {
    let user = await User.findById(userId)
    user?.set('email', undefined)
    user?.set('password', undefined)
    user?.set('credits', undefined)

    return JSON.stringify(user)
  } catch (err) {
    return 'There is not user with that identifier.'
  }
}

export async function login (email: string, password: string) {
  // should be finished with token generation
  // and more security
  try {
    let user = await User.findOne({ email })

    // @ts-ignore
    if (user.password === password) {
      return 'Logged success.'
    } else {
      return 'Password does not match.'
    }
  } catch (err) {
    return 'This user does not exists in our database.'
  }
}
