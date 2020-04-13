import Sound from '../models/Sound'
import User from '../models/User'
import { handleError } from '../controllers/errorsController'

/**
 *
 */
export async function getSounds () {
  try {
    let sounds = await Sound.find()
    if (!sounds) return handleError({ type: 400, message: 'An error has occured.' })

    sounds = sounds.filter(
      // @ts-ignore
      sound => sound.validated === true && sound.public === true
    )

    return handleError({ type: 200, message: JSON.stringify(sounds) })
  } catch (err) {
    return handleError({ type: 400, message: 'An error has occured.' })
  }
}

/**
 *
 * @param userId
 */
export async function getSoundsFromUserId (userId: string) {
  try {
    const sounds = await Sound.find({ owner: userId })
    if (!sounds) return handleError({ type: 400, message: 'An error has occured.' })

    return handleError({ type: 200, message: JSON.stringify(sounds) })
  } catch (err) {
    return handleError({ type: 400, message: 'An error has occured.' })
  }
}

/**
 *
 * @param soundId
 */
export async function getSound (soundId: string) {
  try {
    const sound = await Sound.findById(soundId)
    if (!sound) handleError({ type: 400, message: 'An error has occured.' })

    handleError({ type: 200, message: JSON.stringify(sound) })
  } catch (err) {
    return handleError({ type: 400, message: 'An error has occured.' })
  }
}

declare interface ICreateSound{
  name: string,
  description: string,
  _public: boolean,
  owner: string
}

/**
 *
 * @param request
 */
export async function createSound (body: ICreateSound) {
  try {
    const { name, description, _public, owner } = body

    if (!name || !description) return handleError({ type: 400, message: 'Please fill data for sound creation.' })
    if (!owner) return handleError({ type: 400, message: "You can't add a sound without an owner." })

    const userOwner = await User.findById(owner)
    if (!userOwner) return handleError({ type: 404, message: 'The owner is not found.' })

    // @ts-ignore
    if (userOwner.credits <= 0) {
      return handleError({ type: 401, message: "You don't have enough credits to create a new sound." })
    }

    const sound = await Sound.create({ name, description, public: _public, owner: userOwner._id })
    if (!sound) return handleError({ type: 400, message: 'An error has occured.' })

    userOwner.updateOne({ $inc: { credits: -1 } }, function (err, raw) {
      if (err) handleError({ type: 400, message: err })
    })

    return handleError({ type: 200, message: 'Sound successfully created.' })
  } catch (err) {
    return handleError({ type: 400, message: 'An error has occured.' })
  }
}

/**
 *
 * @param soundId
 */
export async function deleteSound (soundId: string) {
  try {
    /* look further for "findByIdAndRemove" && "findByIdAndDelete" */
    const sound = await Sound.findById(soundId)
    if (!sound) return handleError({ type: 400, message: 'There is not sound with this identifier.' })

    const removed = await sound.remove()
    if (!removed) return handleError({ type: 400, message: 'An error has occured' })

    return handleError({ type: 200, message: 'The sound has been removed successfully.' })
  } catch {
    return handleError({ type: 400, message: 'An error has occured.' })
  }
}
