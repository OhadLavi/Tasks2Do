import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  listName: {
    type: String,
    required: true
  },
  color: {
    type: String,
  },
});

const ListT = mongoose.model('list', listSchema);

export default ListT;