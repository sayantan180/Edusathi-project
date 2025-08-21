import mongoose, { Schema, Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface IOrder extends Document {
  contentId: Types.ObjectId;
  studentId: Types.ObjectId;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>({
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'pending', index: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOrder>('Order', OrderSchema);
