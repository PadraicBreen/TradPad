let path = require('path');

let logger = require('util/logger').create("Application");;
let app = require('app');
let fs = app.fs;

function loggerStream(path) {
  return fs.createWriteStream(path, {'flags': 'a'});
}


async function start() {
   // Share the logger
  app.env.logger = logger;

  logger.log("Initializing Core Application");
  logger.log("  Loaded Virtual File System");
  for (let desc of app.configDescription()) {
    logger.log("    " + desc);
  }
  process.nextTick(()=> app.events.emit("/", "appStarted"));
}

app.onLoaded(start);