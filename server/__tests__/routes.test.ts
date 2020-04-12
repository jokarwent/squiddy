import request from 'supertest'
import app, { database } from '../index'
import User from '../models/User'

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
    expect(response.text).toEqual('Logged success.')
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
    expect(response.text).toEqual('This user does not exists in our database.')
  })

  test('GET - Retrieving a user - /user/5e920caa1b8fb91ab1f5c04d', async () => {
    const response = await request(app.callback()).get(
      '/user/5e920caa1b8fb91ab1f5c04d'
    )
    expect(response.text).not.toEqual('{}')
  })

  test('GET - Retrieving a non existing user - /user/0000 - FAIL', async () => {
    const response = await request(app.callback()).get('/user/0000')
    expect(response.text).toEqual('There is not user with that identifier.')
  })

  test('POST - Try to create a user with the same email - /user/register  - FAIL', async () => {
    const response = await request(app.callback())
      .post('/user/register')
      .send({
        name: 'Freemaan',
        email: 'free@squiddy.io',
        adult: false,
        password: 'nopassword123',
        passwordVerification: 'nopassword123'
      })
    expect(response.text).toEqual(
      'A user with the same name or the same email is already existing.'
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
      'A user with the same name or the same email is already existing.'
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
        passwordVerification: 'lolnope'
      })
    expect(response.text).toEqual('The user has been added successfully.')
  })

  test('DELETE - Delete a existing user - /user/', async () => {
    const getUser = await User.findOne({ name: 'RandomDoode' })
    const response = await request(app.callback()).delete(
      '/user/' + getUser?._id
    )
    expect(response.text).toEqual('The user has been removed successfully.')
  })

  test('DELETE - Try to delete a not existing user - /user/ - FAIL', async () => {
    const response = await request(app.callback()).delete('/user/notexisting')
    expect(response.text).toEqual("There's no user with this identifier.")
  })
})
