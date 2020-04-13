import { Schema, model } from 'mongoose'

const SoundSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  description: String,
  url: String, /* should change this to url -> fileName? */
  public: Boolean,
  validated: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Sound = model('Sound', SoundSchema)

export default Sound
