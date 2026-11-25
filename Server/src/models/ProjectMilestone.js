import mongoose from 'mongoose';

const projectMilestoneSchema = new mongoose.Schema(
  {
    clientProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientProject',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
      index: true,
    },
    completedAt: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ProjectMilestone = mongoose.model('ProjectMilestone', projectMilestoneSchema);
