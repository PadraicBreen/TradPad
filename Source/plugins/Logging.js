/* global Reflect */

const util = require('util');
const fs = require('app').fs;
const os = require('os');
const types = require('types');
const timestamp = Symbol("timestamp");


const levels = types.createEnum("error", "warn", "log", "info", "debug");


var defaultLevel = levels.info;

var openStream = function(path) {
  return fs.createWriteStream(path, {'flags': 'a'});
};

var writeTimestamp = function (wr, date) {
  wr.write(os.EOL + "Time: " + date.toLocaleTimeString() + os.EOL + "===============" + os.EOL);
};

function writeLog(name,level, message) {
  let oldTime = wr[timestamp];
  let date = new Date();
  let newTime = Math.floor(date.getTime() / 1000);

  if (oldTime !== newTime) {
    wr[timestamp] = newTime;
    writeTimestamp(wr, date);
  }
  wr.write(formatter(message));
  wr.write(os.EOL);
}


function terminate(...args) {
  this.error(...args);
  process.exit(1);
}

console.terminate = terminate;

function noop() {}

function create(path, properties = {}) {
  path = "/logs/" + path + "%d.log"
  var writeStream = createStream(path);
  var logger = types.createKeyedDispatch(noop, levels);
  logger.terminate = terminate;

  let customFormatters = properties.formatters || {};
  switch (properties.level || exports.defaultLevel) {
    case levels.debug :
      logger.debug = writeLog.bind(logger, writeStream, customFormatters.debug || formatters.debug);
    case levels.info :
      logger.info = writeLog.bind(logger, writeStream, customFormatters.info || formatters.info);
    case levels.log :
      logger.log = writeLog.bind(logger, writeStream, customFormatters.log || formatters.log);
    case levels.warn :
      logger.warn = writeLog.bind(logger, writeStream, customFormatters.warn || formatters.warn);
    case levels.error :
      logger.error = writeLog.bind(logger, writeStream, customFormatters.error || formatters.error);
  }
  return logger;
}

exports.create = create;
exports.levels = levels;
Reflect.defineProperty(exports, "defaultLevel", {
  get: () => defaultLevel,
  set: (value) => {
    defaultLevel = types.validEnum(levels, value, "Log Level");
  }
});
Reflect.defineProperty(exports, "createStream", {
  get: () => createStream,
  set: (func) => {
    createStream = types.validFunc(func);
  }
});
Reflect.defineProperty(exports, "openStream", {
  get: () => openStream,
  set: (func) => {
    openStream = types.validFunc(func);
  }
});