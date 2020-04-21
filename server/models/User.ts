import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, default: 'A user without a name' },
  email: { type: String, default: 'no@mail.io' },
  password: { type: String, default: 'password123' },
  credits: { type: Number, default: 0 },
  adult: { type: Boolean, default: false }
})

UserSchema.index({ email: 1 }, { unique: true }) 
const User = model('User', UserSchema)

export default User
