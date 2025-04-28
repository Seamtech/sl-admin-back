import mongoose from 'mongoose';

const RequestLogSchema = new mongoose.Schema({
  method: String,
  url: String,
  statusCode: Number,
  ip: String,
  request: {
    headers: Object,
    query: Object,
    body: Object,
  },
  response: {
    payload: mongoose.Schema.Types.Mixed,
  },
  timestamp: { type: Date, default: Date.now },
});

export const RequestLog = mongoose.model('RequestLog', RequestLogSchema);
