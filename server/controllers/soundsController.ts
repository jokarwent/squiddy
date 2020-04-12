import Sound from '../models/Sound'
import { Types } from 'mongoose'
import User from '../models/User'
import { getUserById } from './usersController'

export async function getSounds () {
  try {
    let sounds = await Sound.find()
    return JSON.stringify(sounds)
  } catch (err) {
    return 'An error has occured.'
  }
}

export async function getSoundsFromUserId (userId: string) {
  try {
    let sounds = await Sound.find({ owner: userId })
    return JSON.stringify(sounds)
  } catch (err) {
    return 'There is not sounds for this user.'
  }
}

export async function getSound (soundId: string) {
  try {
    let sound = await Sound.findById(soundId)
    return JSON.stringify(sound)
  } catch (err) {
    return 'There is no sound with this identifier.'
  }
}

export async function createSound (request: object) {
  if (JSON.stringify(request) !== '{}') {
    // @ts-ignore
    if (request.owner === undefined) {
      return "You can't add a sound without an owner."
    } else {
      // @ts-ignore
      let owner = await User.findById(request.owner)

      if (owner.credits <= 0) {
        return "You don't have enough credits to create a new sound."
      } else {
        let sound = Sound.create(request)

        if (sound !== undefined) {
          // @ts-ignore
          let user = await User.findByIdAndUpdate(request.owner, {
            $inc: { credits: -5 }
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
