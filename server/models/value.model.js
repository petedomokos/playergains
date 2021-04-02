import mongoose from 'mongoose'

export default new mongoose.Schema({
  measure:{
    type:{type:mongoose.Schema.ObjectId, ref:'Measure'},
    required:'Measure is required'
  },
  value:{
    type:String,
    required:'Value is required'
  }
})

