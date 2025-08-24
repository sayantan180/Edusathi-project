import mongoose from 'mongoose';

const { Schema } = mongoose;

const TemplateSelectionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

TemplateSelectionSchema.index({ userId: 1 }, { unique: false });

const TemplateSelection = mongoose.models.TemplateSelection || mongoose.model('TemplateSelection', TemplateSelectionSchema);
export default TemplateSelection;
