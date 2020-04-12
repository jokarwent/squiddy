import mongoose from 'mongoose'

import User from '../models/User'
import Sound from '../models/Sound'
import Soundbox from '../models/Soundbox'

describe('Mongoose Schemas Test', () => {
  let connection: typeof mongoose

  beforeAll(async () => {
    connection = await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  test('Add a single user', async () => {
    var jokUser = {
      name: 'JokArwent',
      email: 'mrxjkz02@gmail.com',
      password: 'saluthackerman',
      credits: 0
    }
    var exist = await User.exists({ name: jokUser.name })

    if (!exist) {
      var newUser = await User.create(jokUser)

      newUser.save(function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Succesfully added user.')
        }
      })
    } else {
      console.log('User is already existing.')
    }
  })

  test('Add a single sound with Jok owner', async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    // Sound.collection.drop()

    const user = await User.findOne({ name: 'JokArwent' })
    const jokSound = {
      name: 'Test',
      description: 'This is a test description.',
      url: 'auto-generated',
      public: false,
      validated: false,
      owner: user._id
    }

    const newSound = await Sound.create(jokSound)
    expect(newSound.owner).toBe(user._id)
  })
})
