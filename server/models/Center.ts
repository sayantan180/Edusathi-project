import mongoose, { Schema, Document } from 'mongoose';

export interface ICenter extends Document {
  _id: mongoose.Types.ObjectId;
  instituteName: string;
  ownerName: string;
  email: string;
  domain: string;
  plan: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

const CenterSchema: Schema = new Schema({
  instituteName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  domain: { type: String, required: true, unique: true },
  plan: { type: String, required: true },
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  status: { type: String, required: true, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<ICenter>('Center', CenterSchema);
