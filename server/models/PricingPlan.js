import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  included: {
    type: Boolean,
    default: true
  }
});

const pricingPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  pricing: {
    monthly: {
      price: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    },
    quarterly: {
      price: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    },
    yearly: {
      price: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    }
  },
  features: [featureSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pricingPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('PricingPlan', pricingPlanSchema);


 
