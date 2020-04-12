import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: {
    type: String,
    default: 'A user without a name',
    unique: true
  },
  email: {
    type: String,
    default: 'no@mail.io',
    unique: true
  },
  password: { type: String, default: 'password123' },
  credits: { type: Number, default: 0 },
  adult: { type: Boolean, default: false }
})

UserSchema.index({ email: 1 })
UserSchema.index({ name: 1 })

const User = model('User', UserSchema)

export default User
