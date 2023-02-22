import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  lists: {
    type: [String],
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});
const Task = mongoose.model('tasks', taskSchema);

export default Task;