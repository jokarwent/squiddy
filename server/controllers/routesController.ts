import { Context } from 'koa'
import { getUserById, createUser, deleteUser, login } from './usersController'
import { getSounds, getSound, getSoundsFromUserId, createSound, deleteSound } from './soundsController'
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
      const { body } = ctx.request
      const res = await createUser(body)

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
    }
  },
  {
    method: 'post',
    uri: '/user/login',
    cb: async (ctx: Context) => {
      // @ts-ignore
      const request = ctx.request.body
      const res = await login(request.email, request.password)
      ctx.body = res
    }
  },
  {
    method: 'delete',
    uri: '/user/:id',
    cb: async (ctx: Context) => {
      const res = await deleteUser(ctx.params.id)

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
    }
  },
  {
    method: 'get',
    uri: '/user/:id',
    cb: async (ctx: Context) => {
      const res = await getUserById(ctx.params.id)

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
    }
  }
]

export const soundsRoutes = [
  {
    method: 'get',
    uri: '/sounds/',
    cb: async (ctx: Context) => {
      const sounds = await getSounds()
      ctx.body = sounds
    }
  },
  {
    method: 'get',
    uri: '/sounds/user/:id',
    cb: async (ctx: Context) => {
      const sounds = await getSoundsFromUserId(ctx.params.id)
      ctx.body = sounds
    }
  },
  {
    method: 'get',
    uri: '/sound/:id',
    cb: async (ctx: Context) => {
      const sounds = await getSound(ctx.params.id)
      ctx.body = sounds
    }
  },
  {
    method: 'post',
    uri: '/sound',
    cb: async (ctx: Context) => {
      // @ts-ignore
      const request = ctx.request.body
      const sounds = await createSound(request)
      ctx.body = sounds
    }
  },
  {
    method: 'delete',
    uri: '/sound/:id',
    cb: async (ctx: Context) => {
      // @ts-ignore
      const sound = await deleteSound(ctx.params.id)
      ctx.body = sound
    }
  }
]
