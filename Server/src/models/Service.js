import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    icon: {
      type: String,
      default: 'Globe', // Lucide icon name or image url
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 300,
    },
    heroDescription: {
      type: String,
      required: [true, 'Hero description is required'],
    },
    benefits: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    deliverables: [
      {
        type: String,
      },
    ],
    process: [
      {
        step: { type: Number },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    faqs: [faqSchema],
    displayOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model('Service', serviceSchema);
