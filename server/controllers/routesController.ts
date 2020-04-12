import { Context } from 'koa'
import { getUserById, createUser, deleteUser, login } from './usersController'
import { getSounds, getSound, getSoundsFromUserId, createSound } from './soundsController'
import User from '../models/User'

// ex: getSounds from 'controller/sound'

export const defaultRoutes = [
  {
    method: 'get',
    uri: '/',
    cb: (ctx: Context) => {
      ctx.body = 'foo'
    }
  }
]

export const userRoutes = [
  {
    method: 'post',
    uri: '/user/register',
    cb: async (ctx: Context) => {
      // @ts-ignore
      let request = ctx.request.body
      let res = await createUser(request)
      ctx.body = res
    }
  },
  {
    method: 'post',
    uri: '/user/login',
    cb: async (ctx: Context) => {
      // @ts-ignore
      let request = ctx.request.body
      let res = await login(request.email, request.password)
      ctx.body = res
    }
  },
  {
    method: 'delete',
    uri: '/user/:id',
    cb: async (ctx: Context) => {
      let res = await deleteUser(ctx.params.id)
      ctx.body = res
    }
  },
  {
    method: 'get',
    uri: '/user/:id',
    cb: async (ctx: Context) => {
      let user = await getUserById(ctx.params.id)
      ctx.body = user
    }
  }
]

export const soundsRoutes = [
  {
    method: 'get',
    uri: '/sounds/',
    cb: async (ctx: Context) => {
      let sounds = await getSounds()
      ctx.body = sounds
    }
  },
  {
    method: 'get',
    uri: '/sounds/user/:id',
    cb: async (ctx: Context) => {
      let sounds = await getSoundsFromUserId(ctx.params.id)
      ctx.body = sounds
    }
  },
  {
    method: 'get',
    uri: '/sound/:id',
    cb: async (ctx: Context) => {
      let sounds = await getSound(ctx.params.id)
      ctx.body = sounds
    }
  },
  {
    method: 'post',
    uri: '/sound',
    cb: async (ctx: Context) => {
      // @ts-ignore
      let request = ctx.request.body
      let sounds = await createSound(request)
      ctx.body = sounds
    }
  }
]
