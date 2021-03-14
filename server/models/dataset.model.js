import mongoose from 'mongoose'

const DatasetSchema = new mongoose.Schema({ 
  name:{
    type: String,
    trim: true,
    required: 'Dataset name is required'
  },
  initials:{
    type: String,
    trim: true,
    required: 'Dataset initials is required'
  },
  desc:String,
  //datasetType:String,
  photo:{data:Buffer,contentType:String},
  //users who have admin rights over this dataset
  admin:[{type:mongoose.Schema.ObjectId, ref:'User'}],
  datapoints:[{type:mongoose.Schema.ObjectId, ref:'Datapoint'}],
  updated: Date,
  created: {type: Date,default: Date.now},
})

//module.exports = {
export default mongoose.model('Dataset', DatasetSchema)
