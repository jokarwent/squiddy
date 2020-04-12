import mongoose from 'mongoose'

export class Database {
  conn: typeof mongoose | undefined

  constructor () {}

  /**
   *
   * @param string
   */
  async connect (string: string) {
    this.conn = await mongoose.connect(string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  }

  /**
   *
   */
  async close () {
    this.conn != undefined ? this.conn?.disconnect() : null
  }
}
