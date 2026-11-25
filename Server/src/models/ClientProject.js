import mongoose from 'mongoose';

const clientProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    projectReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned client is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    scope: {
      type: String,
      default: '',
    },
    deliverables: [
      {
        type: String,
      },
    ],
    services: [
      {
        type: String,
      },
    ],
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetCompletionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Review', 'On Hold', 'Completed', 'Cancelled'],
      default: 'Planning',
      index: true,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    clientUpdates: [
      {
        update: { type: String, required: true },
        date: { type: Date, default: Date.now },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    internalNotes: [
      {
        note: { type: String, required: true },
        date: { type: Date, default: Date.now },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    deliverableFiles: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ClientProject = mongoose.model('ClientProject', clientProjectSchema);
