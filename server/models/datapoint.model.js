import mongoose from 'mongoose'

const DatapointSchema = new mongoose.Schema({ 
  updated: Date,
  created: {type: Date,default: Date.now},
})

//module.exports = {
export default mongoose.model('Datapoint', DatapointSchema)
