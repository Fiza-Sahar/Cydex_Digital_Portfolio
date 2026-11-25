import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
    },
    budgetRange: {
      type: String,
      default: 'Not specified',
    },
    timeline: {
      type: String,
      default: 'Flexible',
    },
    projectTitle: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    details: {
      type: String,
      required: [true, 'Project details are required'],
    },
    preferredContactMethod: {
      type: String,
      enum: ['Email', 'Phone', 'Video Call'],
      default: 'Email',
    },
    privacyConsent: {
      type: Boolean,
      required: [true, 'Privacy consent is required'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Closed'],
      default: 'New',
      index: true,
    },
    internalNotes: [
      {
        note: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    convertedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientProject',
      default: null,
    },
    emailNotification: {
      status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'skipped'],
        default: 'pending',
      },
      recipient: { type: String, default: 'cydexdigital@gmail.com' },
      messageId: { type: String, default: null },
      error: { type: String, default: null },
      sentAt: { type: Date, default: null },
      attempts: { type: Number, default: 0 },
      lastAttemptAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
