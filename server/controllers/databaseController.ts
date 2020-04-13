import mongoose from 'mongoose'

export class Database {
  conn: typeof mongoose | undefined

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
    if (this.conn) {
      this.conn.disconnect()
    }
  }
}
