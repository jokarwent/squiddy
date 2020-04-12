import Sound from '../models/Sound'
import { Types } from 'mongoose'
import User from '../models/User'
import { getUserById } from './usersController'

/**
 *
 */
export async function getSounds () {
  try {
    let sounds = await Sound.find()

    sounds = sounds.filter(
      sound => sound.validated === true && sound.public === true
    )

    return JSON.stringify(sounds)
  } catch (err) {
    return 'An error has occured.'
  }
}

/**
 *
 * @param userId
 */
export async function getSoundsFromUserId (userId: string) {
  try {
    let sounds = await Sound.find({ owner: userId })
    return JSON.stringify(sounds)
  } catch (err) {
    return 'There is not sounds for this user.'
  }
}

/**
 *
 * @param soundId
 */
export async function getSound (soundId: string) {
  try {
    let sound = await Sound.findById(soundId)
    return JSON.stringify(sound)
  } catch (err) {
    return 'There is no sound with this identifier.'
  }
}

/**
 *
 * @param request
 */
export async function createSound (request: object) {
  if (JSON.stringify(request) !== '{}') {
    // @ts-ignore
    if (request.owner === undefined) {
      return "You can't add a sound without an owner."
    } else {
      // @ts-ignore
      let owner = await User.findById(request.owner)

      // @ts-ignore
      if (owner?.credits <= 0) {
        return "You don't have enough credits to create a new sound."
      } else {
        let sound = Sound.create(request)

        if (sound !== undefined) {
          // @ts-ignore
          let user = await User.findByIdAndUpdate(request.owner, {
            $inc: { credits: -1 }
          })

          return 'Sound successfully created.'
        } else {
          return 'An error has occured.'
        }
      }
    }
  } else {
    return 'Please fill data for sound creation.'
  }
}

/**
 *
 * @param soundId
 */
export async function deleteSound (soundId: string) {
  try {
    let sound = await Sound.findById(soundId)

    if (sound !== undefined) {
      let removed = await sound?.remove()

      if (removed !== undefined) {
        return 'The sound has been removed successfully.'
      } else {
        return 'An error has occured.'
      }
    }
  } catch (err) {
    return "There's no sound with this identifier."
  }
}
