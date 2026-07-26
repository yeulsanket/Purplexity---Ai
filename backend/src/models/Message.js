import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  snippet: String,
});

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: 'unknown',
    },
    sources: [sourceSchema],
  },
  {
    timestamps: true,
  }
);

// Add indexes as requested
messageSchema.index({ chatId: 1 });
messageSchema.index({ user: 1 });
messageSchema.index({ createdAt: 1 });

export default mongoose.model('Message', messageSchema);
