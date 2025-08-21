import mongoose, { Schema, Document, Model } from "mongoose";

export type ContentType = "pdf" | "video" | "live";

export interface IContent extends Document {
  title: string;
  description: string;
  type: ContentType;
  price: number; // in INR rupees
  businessName: string;
  creatorId?: mongoose.Types.ObjectId;
  resourceUrl?: string; // pdf or video url
  liveLink?: string; // live meeting link
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema<IContent> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["pdf", "video", "live"], required: true },
    price: { type: Number, required: true, min: 0 },
    businessName: { type: String, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User" },
    resourceUrl: { type: String },
    liveLink: { type: String },
  },
  { timestamps: true }
);

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema);
export default Content;
