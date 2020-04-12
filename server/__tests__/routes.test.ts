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
  test('/user/login Login as Jok', async () => {
    const response = await request(app.callback())
      .post('/user/login')
      .send({ email: 'jok@squiddy.io', password: 'nopassword' })
    expect(response.text).toEqual('Logged success.')
  })

  test('/user/login Login fail as Free with a fake password', async () => {
    const response = await request(app.callback())
      .post('/user/login')
      .send({ email: 'free@squiddy.io', password: 'fakepassword' })
    expect(response.text).toEqual('Password does not match.')
  })

  test('/user/login Login fail as non existing user', async () => {
    const response = await request(app.callback())
      .post('/user/login')
      .send({ email: 'none@none.io', password: 'nonepassword' })
    expect(response.text).toEqual('This user does not exists in our database.')
  })

  test('/user/5e920caa1b8fb91ab1f5c04d Retrieving a user', async () => {
    const response = await request(app.callback()).get(
      '/user/5e920caa1b8fb91ab1f5c04d'
    )
    expect(response.text).not.toEqual('{}')
  })

  test('/user/0000 Retrieving a non existing user fail', async () => {
    const response = await request(app.callback()).get('/user/0000')
    expect(response.text).toEqual('There is not user with that identifier.')
  })

  test('/user/register Try to create a user with the same email fail', async () => {
    const response = await request(app.callback())
      .post('/user/register')
      .send({
        name: 'Freemaan',
        email: 'free@squiddy.io',
        adult: false,
        password: 'nopassword',
        passwordVerification: 'nopassword'
      })
    expect(response.text).toEqual(
      'A user with the same name or the same email is already existing.'
    )
  })

  test('/user/register Try to create a user with the same name fail', async () => {
    const response = await request(app.callback())
      .post('/user/register')
      .send({
        name: 'JokArwent',
        email: 'jok@squiddy.io',
        adult: true,
        password: 'nopassword',
        passwordVerification: 'nopassword'
      })
    expect(response.text).toEqual(
      'A user with the same name or the same email is already existing.'
    )
  })

  test('/user/register Try to create a user without informations fail', async () => {
    const response = await request(app.callback()).post('/user/register')
    expect(response.text).toEqual('Please fill data for user creation.')
  })

  test('/user/register Create a new user', async () => {
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

  test('/user/ Delete a existing user', async () => {
    const getUser = await User.findOne({ name: 'RandomDoode' })
    const response = await request(app.callback()).delete(
      '/user/' + getUser?._id
    )
    expect(response.text).toEqual('The user has been removed successfully.')
  })

  test('/user/ Try to delete a not existing user fail', async () => {
    const response = await request(app.callback()).delete('/user/notexisting')
    expect(response.text).toEqual("There's no user with this identifier.")
  })
})
