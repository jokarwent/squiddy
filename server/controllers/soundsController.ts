import Sound from '../models/Sound'
import User from '../models/User'
import { handleError } from '../controllers/errorsController'

interface ISound {
  validated: boolean
  public: boolean
}

/**
 *
 */
export async function getSounds() {
  let sounds = await Sound.find()
  return sounds.filter(sound => sound.validated && sound.public)
}

/**
 *
 * @param userId
 */
export async function getSoundsFromUserId(userId: string, user) {
  const sounds = await Sound.find({ owner: userId })

  // user in request is not the owner
  if (user.id === userId) {
    return sounds
  }

  return sounds.filter(({ validated, public }) => validated && public)
}

/**
 *
 * @param soundId
 */
export async function getSound(soundId: string) {
  try {
    const sound = await Sound.findById(soundId)
    if (!sound) handleError({ type: 400, message: 'An error has occured.' })

    handleError({ type: 200, message: JSON.stringify(sound) })
  } catch (err) {
    return handleError({ type: 400, message: 'An error has occured.' })
  }
}

declare interface ICreateSound {
  soundData: object,
  name: string,
  description: string,
  _public: boolean,
  validated: boolean,
  owner: string
}

/**
 *
 * @param body
 */
export async function createSound(body: ICreateSound, user) {
  try {
    const { soundData, name, description, validated, _public } = body

    if (!soundData) throw new Error("You can't add a sound without a file.")
    if (!name || !description) return handleError({ type: 400, message: 'Please fill data for sound creation.' })
    if (!user?.id) return handleError({ type: 400, message: "You can't add a sound without an owner." })

    const userOwner = await User.findById<ICreateSound>(user?.id)
    if (!userOwner) return handleError({ type: 404, message: 'The owner is not found.' })

    if (userOwner.credits <= 0) {
      return handleError({ type: 401, message: "You don't have enough credits to create a new sound." })
    }

    /* need a better handle for this */
    const fp = require('file-type')
    const uuid = require('uuid')
    const fileName = uuid.v4().replace(/-/g, '')

    const type = await fp.fromBuffer(Buffer.from(soundData))

    const sound = await Sound.create({ name, description, public: _public, validated, owner: userOwner._id, url: fileName + '.' + type.ext })
    if (!sound) return handleError({ type: 400, message: 'An error has occured.' })

    await createSoundFile(soundData, fileName + '.' + type.ext)

    userOwner.updateOne({ $inc: { credits: -1 } }, function (err, raw) {
      if (err) handleError({ type: 400, message: err })
    })

    return handleError({ type: 200, message: 'Sound successfully created.' })
  } catch (err) {
    return handleError({ type: 400, message: 'An error has occured.' })
  }
}

async function createSoundFile(soundData: any, fileName: string) {
  /* may use import instead of require maybe? TODO */
  const fs = require('fs')
  const path = require('path')

  return fs.writeFile(path.join(__dirname, '../uploads/' + fileName), Buffer.from(soundData))
}

/**
 *
 * @param soundId
 */
export async function deleteSound(soundId: string) {
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

export async function getSoundUrl(soundId: string) {
  const sound = await Sound.findById(soundId)
}
