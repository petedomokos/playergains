import mongoose from 'mongoose';
import ValueSchema from './value.model';

const DatapointSchema = new mongoose.Schema({ 
  //could be one player, or an array of players
  player:{type:mongoose.Schema.ObjectId, ref:'User'},
  players:[{type:mongoose.Schema.ObjectId, ref:'User'}],
  values:[ValueSchema],
  date:{type: Date,default: Date.now},
  created: {type: Date,default: Date.now},
  notes:String,
  updated: Date
})

//module.exports = {
export default mongoose.model('Datapoint', DatapointSchema)
