console.log("================================================");
let app = require("app");
console.log("Loading Main App");
let fs = require("fs");
requireIfPresent("./plugins");
requireIfPresent("./plugins/filetypes");


app.events.emit('/','bootstrap');

function requireIfPresent(path) {
  if(fs.existsSync(path)) {
    console.log("Loading modules from: " + path);
    require(path + "/plugins.js");
  }
}