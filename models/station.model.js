const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationSchema = new Schema({
  stop_id: String,
  code: String, 
  name: String,
  description: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  parent_station: String,
  zone_id: String
});

const Station = mongoose.model('station', stationSchema);
module.exports = Station;