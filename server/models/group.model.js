import mongoose from 'mongoose'
//import DatasetSchema from './dataset.model'

const GroupSchema = new mongoose.Schema({ 
  name:{
    type: String,
    trim: true,
    required: 'Group name is required'
  },
  photo:{data:Buffer,contentType:String},
  //users who have admin rights over this group
  admin:[{type:mongoose.Schema.ObjectId, ref:'User'}],
  players:[{type:mongoose.Schema.ObjectId, ref:'User'}],
  //datasets:[DatasetSchema],
  updated: Date,
  created: {type: Date,default: Date.now},
})

//module.exports = {
export default mongoose.model('Group', GroupSchema)
