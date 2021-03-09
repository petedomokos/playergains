import Group from '../models/group.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'

/*
attempts to create a new group in in db. 
*/
//creategroup
const create = async (req, res) => {
  console.log('body', req.body)
  const group = new Group(req.body)
  console.log('creating group', group)
  try {
    await group.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load group and append to req.
 */
const groupByID = async (req, res, next, id) => {
  //console.log('readgroupById......', id)
  try {
    let group = await Group.findById(id)
    if (!group)
      return res.status('400').json({
        error: "Group not found"
      })
    req.profile = group
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve group"
    })
  }
}

const read = (req, res) => {
  console.log('read group......', req.profile)
  return res.json(req.profile)
}

const list = async (req, res) => {
  //const fakeGroups = [{_id:"1", name:"a group", email:"a@b.com"}]
  //res.json(fakeGroups)
  try {
    let groups = await Group.find().select('name photo created')
    console.log('returning groups now.......................')
    console.log('returning groups.......................', groups)
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
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let group = req.profile
    group = extend(group, fields)
    group.updated = Date.now()
    console.log('group now', group)
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
    let group = req.profile
    let deletedGroup = await group.remove()
    res.json(deletedGroup)
  } catch (err) {
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
  update
}
