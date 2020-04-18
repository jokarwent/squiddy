import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import { userRoutes, defaultRoutes, soundsRoutes } from './controllers/routesController'
import { Database } from './controllers/databaseController'
import { handleError } from './controllers/errorsController'

const app = new Koa()
const router = new Router()

export const database = new Database()

// put the connecting string in env maybe
database.connect('mongodb://localhost:27017/test')

// need a better way to all routes
for (const { method, uri, cb } of defaultRoutes) {
  // @ts-ignore
  router[method](uri, ctx => {
    try {
      return cb(ctx)
    } catch (e) {
      console.log(e)
      return handleError({ type: 400, message: e.message })
    }
  })
}

for (const { method, uri, cb } of userRoutes) {
  // @ts-ignore
  router[method](uri, cb)
}

for (const { method, uri, cb } of soundsRoutes) {
  // @ts-ignore
  router[method](uri, cb)
}

app.use(bodyParser(
  {
    jsonLimit: '2mb' /* thanks to zebedixeuroslekilo for helping me out xD */
  }
))
app.use(router.routes())

export default app
