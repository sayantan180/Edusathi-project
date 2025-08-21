import mongoose, { Schema, Document, Types } from 'mongoose';

export type ContentType = 'pdf' | 'video' | 'live';

export interface IContent extends Document {
  title: string;
  description: string;
  type: ContentType;
  price: number;
  fileUrl: string;
  thumbnailUrl: string;
  resourceUrl?: string;
  liveLink: string;
  creatorId: Types.ObjectId;
  businessId?: Types.ObjectId | null;
  businessName?: string;
  isActive: boolean;
  createdAt: Date;
}

const ContentSchema: Schema = new Schema<IContent>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'video', 'live'], required: true },
  price: { type: Number, required: true, min: 0 },
  fileUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  resourceUrl: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', default: null },
  businessName: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IContent>('Content', ContentSchema);
