import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  contentId: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  amount: number; // in paise for Razorpay
  currency: string; // e.g. INR
  status: 'created' | 'paid' | 'failed';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
      },
    ],
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
