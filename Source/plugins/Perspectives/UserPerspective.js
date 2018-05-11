

const app = require("app");
const constants = require("constants");
const vfs = app.fs;

var links = [];

const rootDirectories = [];

async function initialize() {
  // If we are running standalone use the Virtual File System Directly as there will be no user groups defined.
  if (app.settings.standalone) {
    return;
  }
  
  // Otherwise read in the user file system structure
  var config = vfs.getJson("/_userFileSystem.settings");
  for (let link of config.links) {
    links.push(link);
    link.directoryPrefix = link.directory + '/';
    let directory = link.directory.substring(1);
    if (!directory.includes('/')) {
      rootDirectories.push(directory);
    }
  }
  links.sort((p1, p2) => p1.root.localeCompare(p2.root) * -1);
  rootDirectories.sort();
  Object.freeze(rootDirectories);
  installUserFileSystem();
  emit("/", "userFsLoaded");
}

function fixPath(path) {
  let credentials = path[constants.credentials];
  for (let link of links) {
    if (path === link.directory || path.startsWith(link.directoryPrefix)) {
      if (!link.actual) {
        return path;
      }
      let actualPath = link.actual + path.substring(link.directory.length);
      actualPath = actualPath.replace('%g', credentials.group).replace('%u', credentials.user)
      return actualPath;
    }
  }
  throw new Error(path + " not found!");
}

function list(path) {
  if (path === '/') {
    return rootDirectories;
  }
  path = fixPath(path, path[constants.credentials]);
  return vfs.list(path);
}

/**
 * Replace the application Virtual File System with this user based filesystem. This give each user a unique
 * view of the filesystem based on their login credentials.
 * 
 * @return {undefined}
 */
function installUserFileSystem() {
  app.fs = {
    get: (path) => vfs.get(fixPath(path)),
    getAsString: (path) => vfs.getAsString(fixPath(path)),
    getJSON: (path) => vfs.getJSON(fixPath(path)),
    list: (path) => vfs.list(fixPath(path)),
    createWriteStream: (path) => vfs.createWriteStream(fixPath(path))
  };
}