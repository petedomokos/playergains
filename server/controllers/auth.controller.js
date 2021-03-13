import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = async (req, res) => {
  console.log('signin......', req.body)
  try {
    let user = await User.findOne({ "email": req.body.email})
      .populate('admin', '_id username firstname surname created')
      .populate('administeredGroups', '_id name desc groupType players admin created')
      .populate('groupsPlayedFor', '_id name desc groupType players admin created')
      //example from old playergains of how to populate deeper paths
      //.populate({ path: 'player.groups', select: 'name _id desc groupType players parent admin coaches subgroups' })

    console.log('signin......a')
    if (!user){
      console.log('signin......b')
      return res.status('401').json({
        error: "User not found"
      })
    }

    if (!user.authenticate(req.body.password)) {
      console.log('signin......c')
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }

    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })
    console.log('signin......d')

    return res.json({
      token,
      user:user
      /*user: {
        _id: user._id,
        name: user.name,
        email: user.email,

      }*/
    })

  } catch (err) {

    return res.status('401').json({
      error: "Could not sign in"
    })

  }
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
})

//req.profile is the user that is being updated or deleted
//they have an admin array, which may be a list of userIds or may be a list of user objects

//todo - not sure how to allow systemAdmin todo anything - I think we just need to always send signedInUserId
//body, because we cant seem to be able to attach it to the jwt sign object on server
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && (
      req.profile._id == req.auth._id ||
      req.profile.admin.includes(req.auth._id) || 
      req.profile.admin.map(user => user._id).includes(req.auth._id) ||
      req.auth.isSystemAdmin
  )
  console.log('authorized???????? ', authorized)
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}
