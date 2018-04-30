
let app = require('app');
let filetypes = app.filetypes;
let fs = app.fs;

var path = require('path');

let imageViews = {
  thumb: {
    type: "png",
    handler: (path) => toThumb(path)
  }
};

filetypes.png = {
  name: "png",
  type: "image/png",
  views: imageViews

};

filetypes.jpg = {
  name: "jpg",
  type: "image/jpeg",
  views: imageViews
};
filetypes.jpeg = filetypes.jpg;

filetypes.gif = {
  name: "gif",
  type: "image/gif",
  views: imageViews
};

