import { Context } from 'koa'
import { getUserById, createUser, deleteUser, login } from './usersController'
import { getSounds, getSound, getSoundsFromUserId, createSound, deleteSound } from './soundsController'

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
      const { body } = ctx.request
      const res = await login(body)

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
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
      const res = await getSounds()

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
    }
  },
  {
    method: 'get',
    uri: '/sounds/user/:id',
    cb: async (ctx: Context) => {
      const res = await getSoundsFromUserId(ctx.params.id)

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
    }
  },
  {
    method: 'get',
    uri: '/sound/:id',
    cb: async (ctx: Context) => {
      const res = await getSound(ctx.params.id)

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
    }
  },
  {
    method: 'post',
    uri: '/sound',
    cb: async (ctx: Context) => {
      // @ts-ignore
      const { body } = ctx.request
      const res = await createSound(body)

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
    }
  },
  {
    method: 'delete',
    uri: '/sound/:id',
    cb: async (ctx: Context) => {
      // @ts-ignore
      const res = await deleteSound(ctx.params.id)

      if (res) {
        ctx.status = res.type
        ctx.body = res.message
      }
    }
  }
]
