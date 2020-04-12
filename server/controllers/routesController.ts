import { Context } from 'koa'
import {
  getUserById,
  createUser,
  deleteUser,
  login
} from './usersController'

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
