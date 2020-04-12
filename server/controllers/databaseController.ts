import mongoose from 'mongoose'

export class Database {
  conn: typeof mongoose | undefined

  constructor () {}

  async connect (string: string) {
    this.conn = await mongoose.connect(string, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  async close () {
    this.conn != undefined ? this.conn?.disconnect() : null
  }
}
