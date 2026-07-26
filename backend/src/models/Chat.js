import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'New Chat',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient querying
chatSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model('Chat', chatSchema);
