/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */
var pathlib = require('path');
var fs = require('fs');

function nameToPath(name, root, fsRoot) {
  return pathlib.join(fsRoot, name.substring(root.length));
}

function list(name) {
  var path = nameToPath(name, this.root, this.fsPath);
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      err ? reject(err) : resolve({json: () => files});
    });
  });
}
function get(name) {
  console.log(name)
  var path = nameToPath(name, this.root, this.fsPath);
  return new Promise((resolve, reject) => {
    resolve({stream: () => fs.createReadStream(path)});
  });
}


function getAsString(name) {
  var path = nameToPath(name, this.root, this.fsPath);
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, text) => {
      err ? reject(err) : resolve({type: "text/plain", string: text});
    });
  });
}

function getJSON(name) {
  var path = nameToPath(name, this.root, this.fsPath);
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, text) => {
      if (err) {
        reject(err);
      }
      else {
        try {
          var json = JSON.parse(text);
          resolve(json);
        }
        catch (e) {
          reject(e);
        }
      }
    });
  });
}

function createWriteStream(name, options) {
  var path = nameToPath(name, this.root, this.fsPath);
  return fs.createWriteStream(path, options);
}

function create(settings) {
  var fsPath = settings.fs;
  var root = settings.root;
  var rootPrefix = root === '/' ? root : root + '/';
  var readonly = settings.readonly === true ? true : false;

  return Object.freeze({
    root: root,
    rootPrefix: rootPrefix,
    fsPath: fsPath,
    readonly: readonly,
    list: list,
    get: get,
    getAsString: getAsString,
    getJSON: getJSON,
    createWriteStream: createWriteStream,

    toString: () => root.padEnd(20, " ") + ": (FileSystem: " + fsPath + ")"
  });
}

// Functions which will be available to external callers
exports.create = create;

