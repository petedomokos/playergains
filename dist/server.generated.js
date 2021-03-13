module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config/config.js":
/*!**************************!*\
  !*** ./config/config.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n//todo - pass MONGODB_URI through as an environment variable (ie a setting) in azure app service\nconst config = {\n  env: \"development\" || false,\n  port: process.env.PORT || 3000,\n  jwtSecret: process.env.JWT_SECRET || \"YOUR_secret_key\",\n  mongoUri: process.env.MONGODB_URI || process.env.MONGO_HOST || 'mongodb+srv://peterdomokos:3Millbrook@switchplaycluster.l5lum.mongodb.net/switchplay_db?retryWrites=true&w=majority' || 'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/playergains'\n};\nconst _default = config;\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(config, \"config\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\config\\\\config.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\config\\\\config.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./config/config.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/harmony-module.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(module) {\n\tif (!module.webpackPolyfill) {\n\t\tmodule.deprecate = function() {};\n\t\tmodule.paths = [];\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/module.js?");

/***/ }),

/***/ "./server/controllers/auth.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/auth.controller.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express_jwt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-jwt */ \"express-jwt\");\n/* harmony import */ var express_jwt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_jwt__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../config/config */ \"./config/config.js\");\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\nconst signin = async (req, res) => {\n  console.log('signin......', req.body);\n\n  try {\n    let user = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n      \"email\": req.body.email\n    }).populate('admin', '_id username firstname surname created').populate('administeredGroups', '_id name desc groupType players admin created').populate('groupsPlayedFor', '_id name desc groupType players admin created'); //example from old playergains of how to populate deeper paths\n    //.populate({ path: 'player.groups', select: 'name _id desc groupType players parent admin coaches subgroups' })\n\n    console.log('signin......a');\n\n    if (!user) {\n      console.log('signin......b');\n      return res.status('401').json({\n        error: \"User not found\"\n      });\n    }\n\n    if (!user.authenticate(req.body.password)) {\n      console.log('signin......c');\n      return res.status('401').send({\n        error: \"Email and password don't match.\"\n      });\n    }\n\n    const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default.a.sign({\n      _id: user._id\n    }, _config_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].jwtSecret);\n    res.cookie(\"t\", token, {\n      expire: new Date() + 9999\n    });\n    console.log('signin......d');\n    return res.json({\n      token,\n      user: user\n      /*user: {\r\n        _id: user._id,\r\n        name: user.name,\r\n        email: user.email,\r\n        }*/\n\n    });\n  } catch (err) {\n    return res.status('401').json({\n      error: \"Could not sign in\"\n    });\n  }\n};\n\nconst signout = (req, res) => {\n  res.clearCookie(\"t\");\n  return res.status('200').json({\n    message: \"signed out\"\n  });\n};\n\nconst requireSignin = express_jwt__WEBPACK_IMPORTED_MODULE_2___default()({\n  secret: _config_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].jwtSecret,\n  userProperty: 'auth'\n}); //req.profile is the user that is being updated or deleted\n//they have an admin array, which may be a list of userIds or may be a list of user objects\n//todo - not sure how to allow systemAdmin todo anything - I think we just need to always send signedInUserId\n//body, because we cant seem to be able to attach it to the jwt sign object on server\n\nconst hasAuthorization = (req, res, next) => {\n  const authorized = req.profile && req.auth && (req.profile._id == req.auth._id || req.profile.admin.includes(req.auth._id) || req.profile.admin.map(user => user._id).includes(req.auth._id) || req.auth.isSystemAdmin);\n  console.log('authorized???????? ', authorized);\n\n  if (!authorized) {\n    return res.status('403').json({\n      error: \"User is not authorized\"\n    });\n  }\n\n  next();\n};\n\nconst _default = {\n  signin,\n  signout,\n  requireSignin,\n  hasAuthorization\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(signin, \"signin\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\auth.controller.js\");\n  reactHotLoader.register(signout, \"signout\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\auth.controller.js\");\n  reactHotLoader.register(requireSignin, \"requireSignin\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\auth.controller.js\");\n  reactHotLoader.register(hasAuthorization, \"hasAuthorization\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\auth.controller.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\auth.controller.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/controllers/auth.controller.js?");

/***/ }),

/***/ "./server/controllers/group.controller.js":
/*!************************************************!*\
  !*** ./server/controllers/group.controller.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _models_group_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/group.model */ \"./server/models/group.model.js\");\n/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/extend */ \"lodash/extend\");\n/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_extend__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n/* harmony import */ var formidable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! formidable */ \"formidable\");\n/* harmony import */ var formidable__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(formidable__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _helpers_dbQueries__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../helpers/dbQueries */ \"./server/helpers/dbQueries.js\");\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\n/*\r\nattempts to create a new group in in db. \r\n*/\n//creategroup\n//must also add id to user.administeredgroups\n//note - it is possible that group may have been fully loaded, in which case\n//arrays like admin will not just be id but will be an object. But if user or group was just created,\n//then only ids are returned. Therefore, we handle both cases.\n//todo - better soln is to send the admin as objects in create methiods in controllers\n//but to do that we need to go into teh database to get them, so need to chain promises\n\nconst create = async (req, res) => {\n  console.log('createGroup');\n  const group = new _models_group_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n  console.log('creating group', group);\n\n  try {\n    await group.save();\n    console.log('success'); //add refderence to this group in all admin users\n\n    group.admin.forEach(userId => {\n      Object(_helpers_dbQueries__WEBPACK_IMPORTED_MODULE_4__[\"addRefToUserArray\"])(userId, 'administeredGroups', group._id);\n    });\n    return res.status(200).json({\n      message: \"Successfully created group!\",\n      group: group\n    });\n  } catch (err) {\n    console.log('failure', err);\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n/**\r\n * Load group and append to req.\r\n */\n\n\nconst groupByID = async (req, res, next, id) => {\n  //console.log('readgroupById......', id)\n  try {\n    let group = await _models_group_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id).populate('admin', '_id username firstname surname').populate('players', '_id username firstname surname'); //example from old playergains of how to populate deeper paths\n    //.populate({ path: 'player.groups', select: 'name _id desc groupType players parent admin coaches subgroups' })\n\n    if (!group) return res.status('400').json({\n      error: \"Group not found\"\n    });\n    req.profile = group;\n    next();\n  } catch (err) {\n    return res.status('400').json({\n      error: \"Could not retrieve group\"\n    });\n  }\n};\n\nconst read = (req, res) => {\n  console.log('read group......', req.profile);\n  return res.json(req.profile);\n};\n\nconst list = async (req, res) => {\n  //const fakeGroups = [{_id:\"1\", name:\"a group\", email:\"a@b.com\"}]\n  //res.json(fakeGroups)\n  try {\n    let groups = await _models_group_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find().select('name photo created admin').populate('admin', '_id username firstname surname');\n    console.log('returning groups now.......................'); //console.log('returning groups.......................', groups)\n\n    res.json(groups);\n  } catch (err) {\n    console.log('error listing groups.......................');\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst update = async (req, res) => {\n  console.log('updating group....................');\n  let form = new formidable__WEBPACK_IMPORTED_MODULE_3___default.a.IncomingForm();\n  form.keepExtensions = true;\n  form.parse(req, async (err, fields, files) => {\n    if (err) {\n      return res.status(400).json({\n        error: \"Photo could not be uploaded\"\n      });\n    }\n\n    let group = req.profile;\n    group = lodash_extend__WEBPACK_IMPORTED_MODULE_1___default()(group, fields);\n    group.updated = Date.now();\n    console.log('group now', group);\n\n    if (files.photo) {\n      group.photo.data = fs.readFileSync(files.photo.path);\n      group.photo.contentType = files.photo.type;\n    }\n\n    try {\n      await group.save();\n      res.json(group);\n    } catch (err) {\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n      });\n    }\n  });\n};\n\nconst remove = async (req, res) => {\n  console.log('remove group..............');\n\n  try {\n    let group = req.profile;\n    let deletedGroup = await group.remove();\n    res.json(deletedGroup);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst _default = {\n  create,\n  groupByID,\n  read,\n  list,\n  remove,\n  update\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(create, \"create\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\group.controller.js\");\n  reactHotLoader.register(groupByID, \"groupByID\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\group.controller.js\");\n  reactHotLoader.register(read, \"read\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\group.controller.js\");\n  reactHotLoader.register(list, \"list\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\group.controller.js\");\n  reactHotLoader.register(update, \"update\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\group.controller.js\");\n  reactHotLoader.register(remove, \"remove\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\group.controller.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\group.controller.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/controllers/group.controller.js?");

/***/ }),

/***/ "./server/controllers/user.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/user.controller.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/extend */ \"lodash/extend\");\n/* harmony import */ var lodash_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_extend__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n/* harmony import */ var formidable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! formidable */ \"formidable\");\n/* harmony import */ var formidable__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(formidable__WEBPACK_IMPORTED_MODULE_3__);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n/*\r\nattempts to create a new user in in db. \r\n*/\n//createuser\n//note - it is possible that group may have been fully loaded, in which case\n//arrays like admin will not just be id but will be an object. But if user or group was just created,\n//then only ids are returned. Therefore, we handle both cases.\n//todo - better soln is to send the admin as objects in create methiods in controllers\n//but to do that we need to go into teh database to get them, so need to chain promises\n\nconst create = async (req, res) => {\n  console.log('create user...body', req.body);\n  const user = new _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n  console.log('created', user);\n\n  try {\n    console.log('trying');\n    await user.save();\n    console.log('success');\n    return res.status(200).json({\n      mesg: \"Successfully signed up!\",\n      user: user\n    });\n  } catch (err) {\n    console.log('failure', err);\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n/**\r\n * Load user and append to req.\r\n */\n\n\nconst userByID = async (req, res, next, id) => {\n  console.log('readuserById......', id);\n\n  try {\n    let user = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id).populate('admin', '_id username firstname surname created').populate('administeredGroups', '_id name desc groupType players admin created').populate('groupsPlayedFor', '_id name desc groupType players admin created'); //example from old playergains of how to populate deeper paths\n    //.populate({ path: 'player.groups', select: 'name _id desc groupType players parent admin coaches subgroups' })\n\n    console.log('user in userById', user);\n    if (!user) return res.status('400').json({\n      error: \"User not found\"\n    });\n    req.profile = user;\n    next();\n  } catch (err) {\n    return res.status('400').json({\n      error: \"Could not retrieve user\"\n    });\n  }\n};\n\nconst read = (req, res) => {\n  console.log('read......');\n  req.profile.hashed_password = undefined;\n  req.profile.salt = undefined;\n  return res.json(req.profile);\n};\n\nconst list = async (req, res) => {\n  //const fakeUsers = [{_id:\"1\", name:\"a user\", email:\"a@b.com\"}]\n  //res.json(fakeUsers)\n  try {\n    let users = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find().select('username firstname surname photo email updated created admin');\n    console.log('returning users now.......................'); //console.log('returning users.......................', users)\n\n    res.json(users);\n  } catch (err) {\n    console.log('error listing users.......................');\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst update = async (req, res) => {\n  console.log('updating user....................');\n  let form = new formidable__WEBPACK_IMPORTED_MODULE_3___default.a.IncomingForm();\n  form.keepExtensions = true;\n  form.parse(req, async (err, fields, files) => {\n    if (err) {\n      return res.status(400).json({\n        error: \"Photo could not be uploaded\"\n      });\n    }\n\n    let user = req.profile;\n    user = lodash_extend__WEBPACK_IMPORTED_MODULE_1___default()(user, fields);\n    user.updated = Date.now();\n    console.log('user now', user);\n\n    if (files.photo) {\n      user.photo.data = fs.readFileSync(files.photo.path);\n      user.photo.contentType = files.photo.type;\n    }\n\n    try {\n      await user.save();\n      user.hashed_password = undefined;\n      user.salt = undefined;\n      res.json(user);\n    } catch (err) {\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n      });\n    }\n  });\n};\n\nconst remove = async (req, res) => {\n  console.log('remove user..............');\n\n  try {\n    let user = req.profile;\n    let deletedUser = await user.remove();\n    deletedUser.hashed_password = undefined;\n    deletedUser.salt = undefined;\n    res.json(deletedUser);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n\nconst _default = {\n  create,\n  userByID,\n  read,\n  list,\n  remove,\n  update\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(create, \"create\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\user.controller.js\");\n  reactHotLoader.register(userByID, \"userByID\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\user.controller.js\");\n  reactHotLoader.register(read, \"read\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\user.controller.js\");\n  reactHotLoader.register(list, \"list\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\user.controller.js\");\n  reactHotLoader.register(update, \"update\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\user.controller.js\");\n  reactHotLoader.register(remove, \"remove\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\user.controller.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\controllers\\\\user.controller.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/controllers/user.controller.js?");

/***/ }),

/***/ "./server/devBundle.js":
/*!*****************************!*\
  !*** ./server/devBundle.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../config/config */ \"./config/config.js\");\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! webpack */ \"webpack\");\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(webpack__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\");\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! webpack-hot-middleware */ \"webpack-hot-middleware\");\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _webpack_config_client_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../webpack.config.client.js */ \"./webpack.config.client.js\");\n/* harmony import */ var _webpack_config_client_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_webpack_config_client_js__WEBPACK_IMPORTED_MODULE_4__);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\n\nconst compile = app => {\n  if (_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].env === \"development\") {\n    const compiler = webpack__WEBPACK_IMPORTED_MODULE_1___default()(_webpack_config_client_js__WEBPACK_IMPORTED_MODULE_4___default.a);\n    const middleware = webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_2___default()(compiler, {\n      publicPath: _webpack_config_client_js__WEBPACK_IMPORTED_MODULE_4___default.a.output.publicPath\n    });\n    app.use(middleware);\n    app.use(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_3___default()(compiler));\n  }\n};\n\nconst _default = {\n  compile\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(compile, \"compile\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\devBundle.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\devBundle.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/devBundle.js?");

/***/ }),

/***/ "./server/express.js":
/*!***************************!*\
  !*** ./server/express.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! compression */ \"compression\");\n/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(compression__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! helmet */ \"helmet\");\n/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(helmet__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../template */ \"./template.js\");\n/* harmony import */ var _routes_user_routes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./routes/user.routes */ \"./server/routes/user.routes.js\");\n/* harmony import */ var _routes_group_routes__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./routes/group.routes */ \"./server/routes/group.routes.js\");\n/* harmony import */ var _routes_auth_routes__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./routes/auth.routes */ \"./server/routes/auth.routes.js\");\n/* harmony import */ var _devBundle__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./devBundle */ \"./server/devBundle.js\");\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\n\n\n\n\n\n //comment out before building for production\n\n\nconst CURRENT_WORKING_DIR = process.cwd();\nconst app = express__WEBPACK_IMPORTED_MODULE_0___default()(); //comment out before building for production\n\n_devBundle__WEBPACK_IMPORTED_MODULE_11__[\"default\"].compile(app); // parse body params and attache them to req.body\n\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_2___default.a.json());\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_2___default.a.urlencoded({\n  extended: true\n}));\napp.use(cookie_parser__WEBPACK_IMPORTED_MODULE_3___default()());\napp.use(compression__WEBPACK_IMPORTED_MODULE_4___default()()); // secure apps by setting various HTTP headers\n\napp.use(helmet__WEBPACK_IMPORTED_MODULE_6___default()()); // enable CORS - Cross Origin Resource Sharing\n\napp.use(cors__WEBPACK_IMPORTED_MODULE_5___default()());\napp.use('/dist', express__WEBPACK_IMPORTED_MODULE_0___default.a.static(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(CURRENT_WORKING_DIR, 'dist'))); // mount routes\n\napp.use('/', _routes_user_routes__WEBPACK_IMPORTED_MODULE_8__[\"default\"]);\napp.use('/', _routes_group_routes__WEBPACK_IMPORTED_MODULE_9__[\"default\"]);\napp.use('/', _routes_auth_routes__WEBPACK_IMPORTED_MODULE_10__[\"default\"]);\napp.get('*', (req, res) => {\n  res.status(200).send(Object(_template__WEBPACK_IMPORTED_MODULE_7__[\"default\"])());\n});\nconst _default = app;\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(CURRENT_WORKING_DIR, \"CURRENT_WORKING_DIR\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\express.js\");\n  reactHotLoader.register(app, \"app\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\express.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\express.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/express.js?");

/***/ }),

/***/ "./server/helpers/dbErrorHandler.js":
/*!******************************************!*\
  !*** ./server/helpers/dbErrorHandler.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {\n/**\r\n * Get unique error field name\r\n */\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\nconst getUniqueErrorMessage = err => {\n  let output;\n\n  try {\n    let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'));\n    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';\n  } catch (ex) {\n    output = 'Unique field already exists';\n  }\n\n  return output;\n};\n/**\r\n * Get the error message from error object\r\n */\n\n\nconst getErrorMessage = err => {\n  let message = '';\n\n  if (err.code) {\n    switch (err.code) {\n      case 11000:\n      case 11001:\n        message = getUniqueErrorMessage(err);\n        break;\n\n      default:\n        message = 'Something went wrong';\n    }\n  } else {\n    for (let errName in err.errors) {\n      if (err.errors[errName].message) message = err.errors[errName].message;\n    }\n  }\n\n  return message;\n};\n\nconst _default = {\n  getErrorMessage\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(getUniqueErrorMessage, \"getUniqueErrorMessage\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbErrorHandler.js\");\n  reactHotLoader.register(getErrorMessage, \"getErrorMessage\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbErrorHandler.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbErrorHandler.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/helpers/dbErrorHandler.js?");

/***/ }),

/***/ "./server/helpers/dbQueries.js":
/*!*************************************!*\
  !*** ./server/helpers/dbQueries.js ***!
  \*************************************/
/*! exports provided: addRefToUserArray, addRefToGroupArray, setRefInUser, setRefInGroup, removeRefFromUserArray, removeRefFromGroupArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addRefToUserArray\", function() { return addRefToUserArray; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addRefToGroupArray\", function() { return addRefToGroupArray; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setRefInUser\", function() { return setRefInUser; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setRefInGroup\", function() { return setRefInGroup; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"removeRefFromUserArray\", function() { return removeRefFromUserArray; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"removeRefFromGroupArray\", function() { return removeRefFromGroupArray; });\n/* harmony import */ var formidable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! formidable */ \"formidable\");\n/* harmony import */ var formidable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(formidable__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n/* harmony import */ var _models_group_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/group.model */ \"./server/models/group.model.js\");\n/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\n //import Player from '../models/player.model'\n\nconst addRefToUserArray = (userId, key, value) => {\n  _models_user_model__WEBPACK_IMPORTED_MODULE_5__[\"default\"].findByIdAndUpdate(userId, {\n    $push: {\n      [key]: value\n    }\n  }, (err, val) => {\n    if (err) console.log(\"ERROR: add \" + key + \" ref to user error:\", _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getErrorMessage(err));else console.log(\"SUCCESS: added \" + key + \" ref to user\");\n  });\n};\nconst addRefToGroupArray = (groupId, key, value) => {\n  _models_group_model__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findByIdAndUpdate(groupId, {\n    $push: {\n      [key]: value\n    }\n  }, (err, val) => {\n    if (err) console.log(\"ERROR: add \" + key + \" ref to group error:\", _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getErrorMessage(err));else console.log(\"SUCCESS: added \" + key + \" ref to group\");\n  });\n};\nconst setRefInUser = (userId, key, value) => {\n  _models_user_model__WEBPACK_IMPORTED_MODULE_5__[\"default\"].findByIdAndUpdate(userId, {\n    $set: {\n      [key]: value\n    }\n  }, (err, val) => {\n    if (err) console.log(\"ERROR: set \" + key + \" ref in user error:\", _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getErrorMessage(err));else console.log(\"SUCCESS: set \" + key + \" ref in user\");\n  });\n};\nconst setRefInGroup = (groupId, key, value) => {\n  _models_group_model__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findByIdAndUpdate(groupId, {\n    $set: {\n      [key]: value\n    }\n  }, (err, val) => {\n    if (err) console.log(\"ERROR: set \" + key + \" ref in group error:\", _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getErrorMessage(err));else console.log(\"SUCCESS: set \" + key + \" ref in group\");\n  });\n};\nconst removeRefFromUserArray = (userId, key, value) => {\n  _models_user_model__WEBPACK_IMPORTED_MODULE_5__[\"default\"].findByIdAndUpdate(userId, {\n    $pull: {\n      [key]: value\n    }\n  }, (err, val) => {\n    if (err) console.log(\"ERROR: remove \" + key + \" ref from user error:\", _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getErrorMessage(err));else console.log(\"SUCCESS: removed \" + key + \" ref from user\");\n  });\n};\nconst removeRefFromGroupArray = (groupId, key, value) => {\n  _models_group_model__WEBPACK_IMPORTED_MODULE_4__[\"default\"].findByIdAndUpdate(groupId, {\n    $pull: {\n      [key]: value\n    }\n  }, (err, val) => {\n    if (err) console.log(\"ERROR: remove \" + key + \" ref from group error:\", _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getErrorMessage(err));else console.log(\"SUCCESS: removed \" + key + \" ref from group\");\n  });\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(addRefToUserArray, \"addRefToUserArray\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbQueries.js\");\n  reactHotLoader.register(addRefToGroupArray, \"addRefToGroupArray\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbQueries.js\");\n  reactHotLoader.register(setRefInUser, \"setRefInUser\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbQueries.js\");\n  reactHotLoader.register(setRefInGroup, \"setRefInGroup\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbQueries.js\");\n  reactHotLoader.register(removeRefFromUserArray, \"removeRefFromUserArray\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbQueries.js\");\n  reactHotLoader.register(removeRefFromGroupArray, \"removeRefFromGroupArray\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\helpers\\\\dbQueries.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/helpers/dbQueries.js?");

/***/ }),

/***/ "./server/models/group.model.js":
/*!**************************************!*\
  !*** ./server/models/group.model.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n //import DatasetSchema from './dataset.model'\n\nconst GroupSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: 'Group name is required'\n  },\n  desc: String,\n  groupType: String,\n  photo: {\n    data: Buffer,\n    contentType: String\n  },\n  //users who have admin rights over this group\n  admin: [{\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.ObjectId,\n    ref: 'User'\n  }],\n  coaches: [{\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.ObjectId,\n    ref: 'User'\n  }],\n  players: [{\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.ObjectId,\n    ref: 'User'\n  }],\n  //datasets:[DatasetSchema],\n  updated: Date,\n  created: {\n    type: Date,\n    default: Date.now\n  }\n}); //module.exports = {\n\nconst _default = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Group', GroupSchema);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(GroupSchema, \"GroupSchema\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\models\\\\group.model.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\models\\\\group.model.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/models/group.model.js?");

/***/ }),

/***/ "./server/models/user.model.js":
/*!*************************************!*\
  !*** ./server/models/user.model.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\nconst UserSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  username: {\n    type: String,\n    trim: true,\n    required: 'Username is required'\n  },\n  firstname: {\n    type: String,\n    trim: true,\n    required: 'First name is required'\n  },\n  surname: {\n    type: String,\n    trim: true,\n    required: 'Surname is required'\n  },\n  photo: {\n    data: Buffer,\n    contentType: String\n  },\n  email: {\n    type: String,\n    trim: true,\n    unique: 'Email already exists',\n    match: [/.+\\@.+\\..+/, 'Please fill a valid email address'],\n    required: 'Email is required'\n  },\n  //roles are player, coach, player-coach\n  isPlayer: {\n    type: Boolean,\n    default: true\n  },\n  isCoach: {\n    type: Boolean,\n    default: true\n  },\n  //other users who have admin rights over this user\n  admin: [{\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.ObjectId,\n    ref: 'User'\n  }],\n  administeredUsers: [{\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.ObjectId,\n    ref: 'User'\n  }],\n  administeredGroups: [{\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.ObjectId,\n    ref: 'Group'\n  }],\n  groupsMemberOf: [{\n    type: mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema.ObjectId,\n    ref: 'Group'\n  }],\n  isSystemAdmin: {\n    type: Boolean,\n    default: false\n  },\n  hashed_password: {\n    type: String,\n    required: \"Password is required\"\n  },\n  salt: String,\n  updated: Date,\n  created: {\n    type: Date,\n    default: Date.now\n  }\n});\nUserSchema.virtual('password').set(function (password) {\n  this._password = password;\n  this.salt = this.makeSalt();\n  this.hashed_password = this.encryptPassword(password);\n}).get(function () {\n  return this._password;\n});\nUserSchema.path('hashed_password').validate(function (v) {\n  if (this._password && this._password.length < 6) {\n    this.invalidate('password', 'Password must be at least 6 characters.');\n  }\n\n  if (this.isNew && !this._password) {\n    this.invalidate('password', 'Password is required');\n  }\n}, null);\nUserSchema.methods = {\n  authenticate: function (plainText) {\n    return this.encryptPassword(plainText) === this.hashed_password;\n  },\n  encryptPassword: function (password) {\n    if (!password) return '';\n\n    try {\n      return crypto__WEBPACK_IMPORTED_MODULE_1___default.a.createHmac('sha1', this.salt).update(password).digest('hex');\n    } catch (err) {\n      return '';\n    }\n  },\n  makeSalt: function () {\n    return Math.round(new Date().valueOf() * Math.random()) + '';\n  }\n};\n\nconst _default = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User', UserSchema);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(UserSchema, \"UserSchema\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\models\\\\user.model.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\models\\\\user.model.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/models/user.model.js?");

/***/ }),

/***/ "./server/routes/auth.routes.js":
/*!**************************************!*\
  !*** ./server/routes/auth.routes.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();\nrouter.route('/auth/signin').post(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signin);\nrouter.route('/auth/signout').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signout);\nconst _default = router;\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(router, \"router\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\routes\\\\auth.routes.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\routes\\\\auth.routes.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/routes/auth.routes.js?");

/***/ }),

/***/ "./server/routes/group.routes.js":
/*!***************************************!*\
  !*** ./server/routes/group.routes.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_group_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/group.controller */ \"./server/controllers/group.controller.js\");\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();\nrouter.route('/api/groups').get(_controllers_group_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].list).post(_controllers_group_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].create);\nrouter.route('/api/groups/:groupId').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_group_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].read).put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_group_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].update).delete(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_group_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].remove);\nrouter.param('groupId', _controllers_group_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].groupByID);\nconst _default = router;\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(router, \"router\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\routes\\\\group.routes.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\routes\\\\group.routes.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/routes/group.routes.js?");

/***/ }),

/***/ "./server/routes/user.routes.js":
/*!**************************************!*\
  !*** ./server/routes/user.routes.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/user.controller */ \"./server/controllers/user.controller.js\");\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();\nrouter.route('/api/users').get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].list).post(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].create);\nrouter.route('/api/users/:userId').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].read).put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].update).delete(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].remove);\nrouter.param('userId', _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].userByID);\nconst _default = router;\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(router, \"router\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\routes\\\\user.routes.js\");\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\server\\\\routes\\\\user.routes.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./server/routes/user.routes.js?");

/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../config/config */ \"./config/config.js\");\n/* harmony import */ var _express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./express */ \"./server/express.js\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\n\n\n // Connection URL\n\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.Promise = global.Promise;\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connect(_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mongoUri, {\n  useNewUrlParser: true,\n  useCreateIndex: true,\n  useUnifiedTopology: true\n});\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connection.on('error', () => {\n  throw new Error(`unable to connect to database: ${_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mongoUri}`);\n});\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connection.on('open', function (ref) {\n  console.log('Connected to mongo server.'); //trying to get collection nameshnhfngf\n\n  mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connection.db.listCollections().toArray(function (err, names) {\n    console.log(names); // [{ name: 'dbname.myCollection' }]\n  });\n});\n_express__WEBPACK_IMPORTED_MODULE_1__[\"default\"].listen(_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port, err => {\n  if (err) {\n    console.log(err);\n  }\n\n  console.info('Server started on port %s.', _config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port);\n});\n\n//# sourceURL=webpack:///./server/server.js?");

/***/ }),

/***/ "./template.js":
/*!*********************!*\
  !*** ./template.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\nconst _default = () => {\n  return `<!doctype html>\n    <html lang=\"en\">\n      <head>\n        <meta charset=\"utf-8\">\n        <title>Switchplay</title>\n        <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Roboto:100,300,400\">\n        <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">\n        <style>\n            a{\n              text-decoration: none;\n              color: #061d95\n            }\n        </style>\n      </head>\n      <body>\n        <div id=\"root\"></div>\n        <script type=\"text/javascript\" src=\"/dist/bundle.js\"></script>\n      </body>\n    </html>`;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(_default, \"default\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\template.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./template.js?");

/***/ }),

/***/ "./webpack.config.client.js":
/*!**********************************!*\
  !*** ./webpack.config.client.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(module) {(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {\n  return a;\n};\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst webpack = __webpack_require__(/*! webpack */ \"webpack\");\n\nconst CURRENT_WORKING_DIR = process.cwd();\nconst config = {\n  name: \"browser\",\n  mode: \"development\",\n  devtool: 'eval-source-map',\n  entry: ['webpack-hot-middleware/client?reload=true', path.join(CURRENT_WORKING_DIR, 'client/main.js')],\n  output: {\n    path: path.join(CURRENT_WORKING_DIR, '/dist'),\n    filename: 'bundle.js',\n    publicPath: '/dist/'\n  },\n  module: {\n    rules: [{\n      test: /\\.jsx?$/,\n      exclude: /node_modules/,\n      use: ['babel-loader']\n    }, {\n      test: /\\.(ttf|eot|svg|gif|jpg|png)(\\?[\\s\\S]+)?$/,\n      use: 'file-loader'\n    }]\n  },\n  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()],\n  resolve: {\n    alias: {\n      'react-dom': '@hot-loader/react-dom'\n    }\n  }\n};\nmodule.exports = config;\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(CURRENT_WORKING_DIR, \"CURRENT_WORKING_DIR\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\webpack.config.client.js\");\n  reactHotLoader.register(config, \"config\", \"C:\\\\Users\\\\peted\\\\Documents\\\\projects\\\\playergains\\\\webpack.config.client.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack:///./webpack.config.client.js?");

/***/ }),

/***/ 0:
/*!********************************!*\
  !*** multi ./server/server.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! C:\\Users\\peted\\Documents\\projects\\playergains\\server\\server.js */\"./server/server.js\");\n\n\n//# sourceURL=webpack:///multi_./server/server.js?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"compression\");\n\n//# sourceURL=webpack:///external_%22compression%22?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cookie-parser\");\n\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-jwt":
/*!******************************!*\
  !*** external "express-jwt" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-jwt\");\n\n//# sourceURL=webpack:///external_%22express-jwt%22?");

/***/ }),

/***/ "formidable":
/*!*****************************!*\
  !*** external "formidable" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"formidable\");\n\n//# sourceURL=webpack:///external_%22formidable%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"helmet\");\n\n//# sourceURL=webpack:///external_%22helmet%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ }),

/***/ "lodash/extend":
/*!********************************!*\
  !*** external "lodash/extend" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash/extend\");\n\n//# sourceURL=webpack:///external_%22lodash/extend%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack\");\n\n//# sourceURL=webpack:///external_%22webpack%22?");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-dev-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-dev-middleware%22?");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-hot-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-hot-middleware%22?");

/***/ })

/******/ });