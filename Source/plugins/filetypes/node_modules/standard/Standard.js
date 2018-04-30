
let app = require('app');
let filetypes = app.filetypes;
let fs = app.fs;

var path = require('path');

filetypes.typeFor = function (pathName) {
  let extension = path.extname(pathName);
  if (extension.length > 0) {
    extension = extension.substring(1);
  }
  else {
    return filetypes.directory;
  }
  let type = filetypes[extension];
  if (!type) {
    type = filetypes.unknown;
  }

  return type;
};
filetypes.all = {
  views: {
    thumb: {
      type: "png",
      handler: (path) => toThumb(path)
    }
  }
};

filetypes.json = {
  name: "json",
  type: "application/json"
};

filetypes.settings = {
  name: "settings",
  type: "application/json"
};

filetypes.schema = {
  name: "schema",
  type: "application/json"
};
filetypes.directory = {
  name: "directory",
  type: "application/json",
  handler: (path) => fs.list(path)
};
filetypes.unknown = {
  name: "unknown",
  type: "application/octet-stream"
};

filetypes.html = {
  name: "html",
  type: "text/html"
};

filetypes.css = {
  name: "css",
  type: "text/css"
};

filetypes.js = {
  name: "js",
  type: "application/javascript"
};

function toThumb(path) {
  
}