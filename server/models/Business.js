import mongoose from 'mongoose';

const { Schema } = mongoose;

const BusinessSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  address: { type: String },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
