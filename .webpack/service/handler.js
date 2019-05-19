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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./handler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./handler.js":
/*!********************!*\
  !*** ./handler.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime/helpers/interopRequireWildcard */ "@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listConnections = exports.messageHandler = exports.test = exports.defaultRoute = exports.connectionHandler = void 0;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _util = __webpack_require__(/*! ./util */ "./util/index.js");

var service = _interopRequireWildcard(__webpack_require__(/*! ./services */ "./services/index.js"));

const success = {
  statusCode: 200
};
const connectionHandler = (0, _util.responseBuilder)(async ({
  requestContext: {
    connectionId,
    routeKey
  }
}) => routeKey === '$connect' ? await service.saveConnectionInfoToDynamoDB(connectionId) : await service.deleteConnectionInfoFromDynamoDB(connectionId));
exports.connectionHandler = connectionHandler;

const defaultRoute = async event => {
  console.log('event in default: ', event);
  return success;
};

exports.defaultRoute = defaultRoute;

const test = async event => {
  console.log('event in test: ', event);
  return success;
}; // assume there is other logic and processes that save "channel" subscriptions for each
// subscriber, along with their connectionId information


exports.test = test;

const messageHandler = async event => {
  const payload = JSON.parse(event.body); // fetch anyone subscribed to a channel defined in payload for a datastore

  const subscribers = await service.getSubscribersToChannel(payload.channelId); // for each subscriber to the channel, we have to send a message per connection
  // (no batch, one call to Api Gateway Management API per message)

  const messages = subscribers.map(async subscriber => {
    return service.sendMessageToSubscriber(subscriber.connectionId, payload);
  }); // make sure they all send

  await Promise.all(messages); // still have to let api gateway know we were succesful!

  return success;
};

exports.messageHandler = messageHandler;
const listConnections = (0, _util.responseBuilder)(async () => await service.listConnections());
exports.listConnections = listConnections;

/***/ }),

/***/ "./repositories/channels.js":
/*!**********************************!*\
  !*** ./repositories/channels.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeToChannel = void 0;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _dynamodb = __webpack_require__(/*! ./dynamodb */ "./repositories/dynamodb.js");

const tableName = process.env.MESSAGE_TABLE;

const subscribeToChannel = async (connectionId, channelId) => {
  return await (0, _dynamodb.addToTable)({
    channelId,
    connectionId
  }, tableName);
};

exports.subscribeToChannel = subscribeToChannel;

/***/ }),

/***/ "./repositories/connections.js":
/*!*************************************!*\
  !*** ./repositories/connections.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime/helpers/interopRequireWildcard */ "@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listConnections = exports.remove = exports.add = void 0;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var dynamoDb = _interopRequireWildcard(__webpack_require__(/*! ./dynamodb */ "./repositories/dynamodb.js"));

const tableName = process.env.CONNECTION_TABLE;

const add = async connectionId => {
  console.log('connecting');
  const addResult = await dynamoDb.addToTable({
    connectionId
  }, tableName);
  console.log('addResult', addResult);
  return addResult;
};

exports.add = add;

const remove = async connectionId => {
  console.log('removing', connectionId);
  const removeResult = await dynamoDb.removeByPrimary(connectionId, tableName, {
    keyName: 'connectionId'
  });
  console.log('removeResult', removeResult);
  return removeResult;
};

exports.remove = remove;

const listConnections = async () => (await dynamoDb.scanTable(tableName)).Items;

exports.listConnections = listConnections;

/***/ }),

/***/ "./repositories/dynamodb.js":
/*!**********************************!*\
  !*** ./repositories/dynamodb.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanTable = exports.updateItem = exports.removeByPrimary = exports.addToTable = void 0;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _awsSdk = _interopRequireDefault(__webpack_require__(/*! aws-sdk */ "aws-sdk"));

_awsSdk.default.config.update({
  region: 'eu-west-2',
  endpoint: 'https://dynamodb.eu-west-2.amazonaws.com'
});

const dynamodbClient = new _awsSdk.default.DynamoDB.DocumentClient();

const addToTable = async (Item, TableName) => {
  const params = {
    TableName,
    Item
  };
  console.log('adding with params:', params);
  const putResult = await dynamodbClient.put(params).promise();
  console.log('result from putting:', putResult);
  return putResult;
};

exports.addToTable = addToTable;

const removeByPrimary = async (itemKey, TableName, {
  keyName,
  type = 'S'
}) => {
  const params = {
    TableName,
    Key: {
      [keyName]: {
        [type]: itemKey
      }
    }
  };
  console.log('removing with params ', params);
  const removeResult = await dynamodbClient.delete(params).promise();
  console.log('result from deleting:', removeResult);
}; // This is the only way it seems to get stuff into a list, but it looks like a fucking pain
// where is momngoose when you need it


exports.removeByPrimary = removeByPrimary;

const updateItem = async () => {
  // const updateResult = await dynamodbClient.updateItem().promise
  console.log('need to make updateItem work');
};

exports.updateItem = updateItem;

const scanTable = async TableName => {
  const params = {
    TableName
  };
  const allResults = await dynamodbClient.scan(params).promise();
  console.log('found,', allResults);
  return allResults;
};

exports.scanTable = scanTable;

/***/ }),

/***/ "./repositories/messages.js":
/*!**********************************!*\
  !*** ./repositories/messages.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

/***/ }),

/***/ "./services/index.js":
/*!***************************!*\
  !*** ./services/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime/helpers/interopRequireWildcard */ "@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listConnections = exports.sendMessageToSubscriber = exports.getSubscribersToChannel = exports.deleteConnectionInfoFromDynamoDB = exports.saveConnectionInfoToDynamoDB = void 0;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var channelRepo = _interopRequireWildcard(__webpack_require__(/*! ../repositories/channels */ "./repositories/channels.js"));

var connectionRepo = _interopRequireWildcard(__webpack_require__(/*! ../repositories/connections */ "./repositories/connections.js"));

var messageRepo = _interopRequireWildcard(__webpack_require__(/*! ../repositories/messages */ "./repositories/messages.js"));

const saveConnectionInfoToDynamoDB = connectionRepo.add;
exports.saveConnectionInfoToDynamoDB = saveConnectionInfoToDynamoDB;
const deleteConnectionInfoFromDynamoDB = connectionRepo.remove;
exports.deleteConnectionInfoFromDynamoDB = deleteConnectionInfoFromDynamoDB;
const getSubscribersToChannel = channelRepo.listSubscribers;
exports.getSubscribersToChannel = getSubscribersToChannel;
const sendMessageToSubscriber = messageRepo.sendMessage;
exports.sendMessageToSubscriber = sendMessageToSubscriber;
const listConnections = connectionRepo.listConnections;
exports.listConnections = listConnections;

/***/ }),

/***/ "./util/index.js":
/*!***********************!*\
  !*** ./util/index.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseBuilder = void 0;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

const responseBuilder = func => async () => {
  try {
    const result = await func();
    console.log('about to return ', {
      statusCode: 200,
      body: JSON.stringify(result)
    });
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e
    };
  }
};

exports.responseBuilder = responseBuilder;

/***/ }),

/***/ "@babel/runtime/helpers/interopRequireDefault":
/*!***************************************************************!*\
  !*** external "@babel/runtime/helpers/interopRequireDefault" ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/interopRequireDefault");

/***/ }),

/***/ "@babel/runtime/helpers/interopRequireWildcard":
/*!****************************************************************!*\
  !*** external "@babel/runtime/helpers/interopRequireWildcard" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/helpers/interopRequireWildcard");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),

/***/ "source-map-support/register":
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ })

/******/ });
//# sourceMappingURL=handler.js.map