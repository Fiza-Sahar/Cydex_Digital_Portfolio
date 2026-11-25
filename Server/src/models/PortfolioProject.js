import mongoose from 'mongoose';

const portfolioProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 300,
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    gallery: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Websites', 'Mobile Applications', 'UI/UX and Design', 'Custom Software', 'Other'],
      index: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    projectType: {
      type: String,
      enum: ['Client Project', 'Concept / Demo', 'Internal Tool', 'Mobile Application'],
      default: 'Concept / Demo',
    },
    clientName: {
      type: String,
      default: '',
    },
    projectUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
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

portfolioProjectSchema.index({ title: 'text', shortDescription: 'text', technologies: 'text' });

export const PortfolioProject = mongoose.model('PortfolioProject', portfolioProjectSchema);
