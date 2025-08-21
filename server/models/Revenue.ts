import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRevenue extends Document {
  creatorId: Types.ObjectId;
  contentId: Types.ObjectId;
  businessId?: Types.ObjectId | null;
  totalSales: number;
  totalEarnings: number;
  updatedAt: Date;
}

const RevenueSchema: Schema = new Schema<IRevenue>({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', default: null },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRevenue>('Revenue', RevenueSchema);
