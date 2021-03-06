import request from 'supertest'
import app, { database } from '../index'
import User from '../models/User'
import { getSounds } from '../controllers/soundsController'

import fs from 'fs'
import path from 'path'

afterAll(() => {
  database.close()
})

describe('Testing available Default routes', () => {
  test('/ Home foo', async () => {
    const response = await request(app.callback()).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('foo')
  })
})

describe('Testing available Users routes', () => {
  test('POST - Login as Jok - /user/login ', async () => {
    const response = await request(app.callback())
      .post('/user/login')
      .send({ email: 'jok@squiddy.io', password: 'nopassword456' })
    expect(response.text).toEqual('Login success.')
  })

  test('POST - Login fail as Free with a fake password - /user/login - FAIL', async () => {
    const response = await request(app.callback())
      .post('/user/login')
      .send({ email: 'free@squiddy.io', password: 'fakepassword' })
    expect(response.text).toEqual('Password does not match.')
  })

  test('POST - Login fail as non existing user - /user/login  - FAIL', async () => {
    const response = await request(app.callback())
      .post('/user/login')
      .send({ email: 'none@none.io', password: 'nonepassword' })
    expect(response.text).toEqual('There is no user found with this email, aborting.')
  })

  test('GET - Retrieving a user - /user/5e9368d44a7f3c30a32b0565', async () => {
    const response = await request(app.callback()).get(
      '/user/5e9368d44a7f3c30a32b0565'
    )
    expect(response.text).not.toEqual('An error has occured.')
  })

  test('GET - Retrieving a non existing user - /user/0000 - FAIL', async () => {
    const response = await request(app.callback()).get('/user/0000')
    expect(response.text).toEqual('There is no user with this identifier, aborting.')
  })

  test('POST - Try to create a user with the same email - /user/register  - FAIL', async () => {
    const response = await request(app.callback())
      .post('/user/register')
      .send({
        name: 'Free',
        email: 'free@squiddy.io',
        adult: false,
        password: 'nopassword123',
        passwordVerification: 'nopassword123'
      })
    expect(response.text).toEqual(
      'A user with the name name/email is already existing.'
    )
  })

  test('POST - Try to create a user with the same name - /user/register - FAIL', async () => {
    const response = await request(app.callback())
      .post('/user/register')
      .send({
        name: 'JokArwent',
        email: 'jok@squiddy.io',
        adult: true,
        password: 'nopassword456',
        passwordVerification: 'nopassword456'
      })
    expect(response.text).toEqual(
      'A user with the name name/email is already existing.'
    )
  })

  test('POST - Try to create a user without informations - /user/register - FAIL', async () => {
    const response = await request(app.callback()).post('/user/register')
    expect(response.text).toEqual('Please fill data for user creation.')
  })

  test('POST - Create a new user - /user/register', async () => {
    const response = await request(app.callback())
      .post('/user/register')
      .send({
        name: 'RandomDoode',
        email: 'dood@squiddy.io',
        password: 'lolnope',
        passwordVerification: 'lolnope',
        adult: false
      })
    expect(response.text).toEqual('User has been added successfully.')
  })

  test('DELETE - Delete a existing user - /user/', async () => {
    const getUser = await User.findOne({ name: 'RandomDoode' })
    const response = await request(app.callback()).delete(
      '/user/' + getUser?._id
    )
    expect(response.text).toEqual('User has been deleted successfully.')
  })

  test('DELETE - Try to delete a not existing user - /user/ - FAIL', async () => {
    const response = await request(app.callback()).delete('/user/notexisting')
    expect(response.text).toEqual('There is no user with this identifier, aborting.')
  })
})

describe('Testing available Sounds routes', () => {
  test('GET - Sounds list - /sounds', async () => {
    const response = await request(app.callback()).get('/sounds')
    expect(response.text).not.toEqual('[]') /* todo look at this later */
  })

  test('GET - Specific sound - /sound/5e92e8415277d0234d648159', async () => {
    const response = await request(app.callback()).get(
      '/sound/5e92e8415277d0234d648159'
    )
    expect(response.text).not.toEqual('[]')
  })

  test('GET - Specific sound - /sound/0000 - FAIL', async () => {
    const response = await request(app.callback()).get('/sound/0000')
    expect(response.text).toEqual('An error has occured.')
  })

  test('GET - Sounds from user - /sounds/user/5e9368d44a7f3c30a32b0565', async () => {
    const response = await request(app.callback()).get(
      '/sounds/user/5e9368d44a7f3c30a32b0565'
    )
    expect(response.text).not.toEqual('[]')
  })

  test('POST - Create sound without informations - /sound - FAIL', async () => {
    const file = fs.readFileSync(path.join(__dirname, '/sounds/whistling.wav'))

    const response = await request(app.callback()).post('/sound').send({ soundData: file })
    expect(response.text).toEqual('Please fill data for sound creation.')
  })

  test('POST - Create sound without valid user - /sound - FAIL', async () => {
    const file = fs.readFileSync(path.join(__dirname, '/sounds/whistling.wav'))

    const response = await request(app.callback())
      .post('/sound')
      .send({
        soundData: file,
        name: 'Test Sound',
        description: 'A testing sound for test purposes.',
        url: 'auto-generated',
        public: false
      })
    expect(response.text).toEqual("You can't add a sound without an owner.")
  })

  test('POST - Create sound with credits - /sound', async () => {
    const file = fs.readFileSync(path.join(__dirname, '/sounds/whistling.wav'))

    const rndName = [
      'Test Sound',
      'Testing sound',
      'Random name for testing',
      'Just a test'
    ]

    const user = await User.findOne({
      name: 'JokArwent'
    })

    const response = await request(app.callback())
      .post('/sound')
      .send({
        soundData: file,
        name: rndName[Math.floor(Math.random() * rndName.length)],
        description: 'A testing sound for test purposes.',
        url: 'auto-generated',
        _public: true,
        validated: true,
        owner: user?._id
      })

    expect(response.text).toEqual('Sound successfully created.')
  })

  test('POST - Create sound without credits - /sound - FAIL', async () => {
    const file = fs.readFileSync(path.join(__dirname, '/sounds/whistling.wav'))

    const rndName = [
      'Test Sound',
      'Testing sound',
      'Random name for testing',
      'Just a test'
    ]

    const user = await User.findOne({
      name: 'Freemaan'
    })

    const response = await request(app.callback())
      .post('/sound')
      .send({
        soundData: file,
        name: rndName[Math.floor(Math.random() * rndName.length)],
        description: 'A testing sound for test purposes.',
        url: 'auto-generated',
        _public: true,
        validated: true,
        owner: user?._id
      })

    expect(response.text).toEqual(
      "You don't have enough credits to create a new sound."
    )
  })

  test('POST - Create sound with fake user id - /sound - FAIL', async () => {
    const file = fs.readFileSync(path.join(__dirname, '/sounds/whistling.mp3'))

    const response = await request(app.callback())
      .post('/sound')
      .send({
        soundData: file,
        name: 'Test Sound',
        description: 'A testing sound for test purposes.',
        url: 'auto-generated',
        public: false,
        owner: '5e9368d44a7f3d30a32z9565'
      })
    expect(response.text).toEqual('An error has occured.')
  })

  test('DELETE - Delete a specific sound - /sound/[randomSoundId]', async () => {
    // @ts-ignore
    const getSoundsList = JSON.parse(await getSounds().then((res) => { return res.message }))
    if (!getSoundsList) console.log("Mhm there's something wrong there.")

    const response = await request(app.callback()).delete(
      '/sound/' + getSoundsList[0]._id
    )

    expect(response.text).toEqual('The sound has been removed successfully.')
  })

  test('DELETE - Delete a non existing sound - /sound/000 - FAIL', async () => {
    const response = await request(app.callback()).delete('/sound/000')

    expect(response.text).toEqual('An error has occured.')
  })
})
