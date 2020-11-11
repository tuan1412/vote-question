const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  yesCount: {
    type: Number,
    default: 0
  },
  noCount: {
    type: Number,
    default: 0
  }
});

const questionModel = mongoose.model('question', questionSchema);

module.exports = questionModel;

