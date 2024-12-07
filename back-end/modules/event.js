const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true,
  },
  employee: {
    type: String,
    required: true,
    trim: true,
  },
  start_time: { 
    type: Date,
    required: true,
  },
  end_time: { 
    type: Date,
    required: true,
  },
  id_owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAt: { 
    type: Date,
    default: Date.now,
  },
});

// Model Event
const Event = mongoose.model('Event', eventSchema, 'Events');

module.exports = Event;
