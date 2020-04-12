import { Schema, model } from 'mongoose'

const SoundboxSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  sounds: [{ type: Schema.Types.ObjectId, ref: 'Sounds' }],
  public: Boolean,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Soundbox = model('Soundbox', SoundboxSchema)

export default Soundbox
