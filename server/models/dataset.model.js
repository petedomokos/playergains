import mongoose from 'mongoose'
import MeasureSchema from './measure.model'
import CalculationSchema from './calculation.model'

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
  measures:[{type:MeasureSchema}],
  calculations:[{type:CalculationSchema}],
  //main value can be a measure key or a calculation key
  mainValueToDisplay:String,
  datapoints:[{type:mongoose.Schema.ObjectId, ref:'Datapoint'}],
  updated: Date,
  created: {type: Date,default: Date.now}
})

//module.exports = {
export default mongoose.model('Dataset', DatasetSchema)
