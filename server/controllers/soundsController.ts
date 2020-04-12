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
