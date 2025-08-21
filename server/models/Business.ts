import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBusiness extends Document {
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  ownerId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

const BusinessSchema: Schema = new Schema<IBusiness>({
  name: { type: String, required: true },
  description: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  address: { type: String },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBusiness>('Business', BusinessSchema);
