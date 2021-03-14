import Group from '../models/group.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import { addRefToGroupArray, addRefToUserArray,
  removeRefFromGroupArray, removeRefFromUserArray } from './../helpers/dbQueries'

/*
attempts to create a new group in in db. 
*/
//creategroup

//must also add id to user.administeredgroups

  //note - it is possible that group may have been fully loaded, in which case
  //arrays like admin will not just be id but will be an object. But if user or group was just created,
  //then only ids are returned. Therefore, we handle both cases.
  //todo - better soln is to send the admin as objects in create methiods in controllers
  //but to do that we need to go into teh database to get them, so need to chain promises
const create = async (req, res) => {
  console.log('createGroup')
  const group = new Group(req.body)
  console.log('creating group', group)
  try {
    await group.save()
    console.log('success')

    //add refderence to this group in all admin users
    group.admin.forEach(userId =>{
      addRefToUserArray(userId, 'administeredGroups', group._id)
    })
    return res.status(200).json({
      message: "Successfully created group!",
      group:group
    })
  } catch (err) {
    console.log('failure', err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load group and append to req.
 */
const groupByID = async (req, res, next, id) => {
  console.log('readgroupById......', id)
  try {
    let group = await Group.findById(id)
        .populate('admin', '_id username firstname surname photo')
        .populate('players', '_id username firstname surname photo')
        .populate('datasets', '_id name desc photo')
         //example from old playergains of how to populate deeper paths
      //.populate({ path: 'player.groups', select: 'name _id desc groupType players parent admin coaches subgroups' })
    console.log('group', group)
    if (!group)
      return res.status('400').json({
        error: "Group not found"
      })
    req.group = group
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve group"
    })
  }
}

const read = (req, res) => {
  console.log('read group......')
  return res.json(req.group)
}

const list = async (req, res) => {
  //const fakeGroups = [{_id:"1", name:"a group", email:"a@b.com"}]
  //res.json(fakeGroups)
  try {
    let groups = await Group.find()
      .select('_id name desc photo groupType admin created') //not players as shallow
      .populate('admin', '_id username firstname surname created')
      //.populate('players', '_id firstname surname photo')

    console.log('returning groups now.......................')
    //console.log('returning groups.......................', groups)
    res.json(groups)
  } catch (err) {
    console.log('error listing groups.......................')
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  console.log('updating group....................')
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    console.log('fields', fields)
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    const { players, datasets, admin } = fields;
    //players field to array
    if(typeof players === 'string'){
      fields.players = players === '' ? [] : players.split(',');
      //WARNING - THIS ADDS EVERY TIME!!!!!!TO EACH PLAYER
      fields.players.forEach(userId =>{
        addRefToUserArray(userId, 'groupsMemberOf', group._id)
      })
    }
    if(typeof datasets === 'string'){
      console.log('datasets are', datasets)
      fields.datasets = datasets === '' ? [] : datasets.split(',')
      /*
      fields.datasets.forEach(datasetId =>{
        addRefToDatasetArray(datasetId, 'groupsInvolved', group._id)
      })
      */
    }

    let group = req.group
    group = extend(group, fields)
    group.updated = Date.now()
    console.log('group now.................', group)
    if(files.photo){
      group.photo.data = fs.readFileSync(files.photo.path)
      group.photo.contentType = files.photo.type
    }
    try {
      await group.save()
      res.json(group)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  console.log('remove group..............')
  try {
    let group = req.group
    let deletedGroup = await group.remove()
    res.json(deletedGroup)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

//DATASETS
const createDataset = async (req, res) => {
  console.log('createDataset')
  const dataset = new Dataset(req.body)
  console.log('creating dset', dataset)
  try {
    await dataset.save()
    console.log('success')

    //add references to the group that created it
    addRefToGroupArray(group._id, 'administeredDatasets', dataset._id)
    addRefToGroupArray(group._id, 'datasets', dataset._id)

    return res.status(200).json({
      message: "Successfully created dataset!",
      group:group
    })
  } catch (err) {
    console.log('failure', err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}




export default {
  create,
  groupByID,
  read,
  list,
  remove,
  update,
  createDataset
}
