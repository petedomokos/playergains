import Dataset from '../models/dataset.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import { addRefToDatasetArray, addRefToUserArray,
  removeRefFromDatasetArray, removeRefFromUserArray } from './../helpers/dbQueries'

/*
attempts to create a new dataset in in db. 
*/
//createdataset

//must also add id to user.administereddatasets

  //note - it is possible that dataset may have been fully loaded, in which case
  //arrays like admin will not just be id but will be an object. But if user or dataset was just created,
  //then only ids are returned. Therefore, we handle both cases.
  //todo - better soln is to send the admin as objects in create methiods in controllers
  //but to do that we need to go into teh database to get them, so need to chain promises
  const create = async (req, res) => {
    console.log('createDataset----------------------------------------')
    const dataset = new Dataset(req.body)
    console.log('creating dset', dataset)
    try {
        await dataset.save()
        console.log('success')
        //add reference to this dataset in all admin users
        dataset.admin.forEach(userId =>{
            addRefToUserArray(userId, 'administeredDatasets', dataset._id)
        })
  
        return res.status(200).json({
            message: "Successfully created dataset!",
            dataset:dataset
        })
    } catch (err) {
        console.log('failure', err)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
  }

/**
 * Load dataset and append to req.
 */
const datasetByID = async (req, res, next, id) => {
  console.log('readdatasetById......', id)
  try {
    let dataset = await Dataset.findById(id)
        .populate('admin', '_id username firstname surname photo')
        .populate('players', '_id username firstname surname photo')
         //example from old playergains of how to populate deeper paths
      //.populate({ path: 'player.datasets', select: 'name _id desc datasetType players parent admin coaches subdatasets' })
    console.log('dataset', dataset)
    if (!dataset)
      return res.status('400').json({
        error: "Dataset not found"
      })
    req.dataset = dataset
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve dataset"
    })
  }
}

const read = (req, res) => {
  console.log('read dataset......')
  return res.json(req.dataset)
}

const list = async (req, res) => {
  //const fakeDatasets = [{_id:"1", name:"a dataset", email:"a@b.com"}]
  //res.json(fakeDatasets)
  try {
    let datasets = await Dataset.find()
      .select('_id name desc photo datasetType admin created') //not players as shallow
      .populate('admin', '_id username firstname surname created')
      //.populate('players', '_id firstname surname photo')

    console.log('returning datasets now.......................')
    //console.log('returning datasets.......................', datasets)
    res.json(datasets)
  } catch (err) {
    console.log('error listing datasets.......................')
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  console.log('updating dataset....................')
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    console.log('fields', fields)
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    //players field to array
    if(fields.players === ''){
      fields.players = [];
    }else{
      const playersArray = fields.players.split(',')
      console.log('playersArray', playersArray)
      fields.players = playersArray
    }
    let dataset = req.dataset
    dataset = extend(dataset, fields)
    dataset.updated = Date.now()
    console.log('dataset now.................', dataset)
    if(files.photo){
      dataset.photo.data = fs.readFileSync(files.photo.path)
      dataset.photo.contentType = files.photo.type
    }
    try {
      await dataset.save()
      res.json(dataset)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  console.log('remove dataset..............')
  try {
    let dataset = req.dataset
    let deletedDataset = await dataset.remove()
    res.json(deletedDataset)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


export default {
  create,
  datasetByID,
  read,
  list,
  remove,
  update
}
