import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import { userRoutes, defaultRoutes } from './controllers/routesController'
import { Database } from './controllers/databaseController'

const app = new Koa()
const router = new Router()
const parser = new bodyParser()

export const database = new Database()

// put the connecting string in env maybe
database.connect('mongodb://localhost:27017/test')

for (const { method, uri, cb } of defaultRoutes) {
  // @ts-ignore
  router[method](uri, cb)
}

for (const { method, uri, cb } of userRoutes) {
  // @ts-ignore
  router[method](uri, cb)
}

app.use(parser)
app.use(router.routes())

export default app
