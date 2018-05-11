console.log("================================================");
let app = require("app");
console.log("Loading Main App");
let fs = require("fs");
var path = require("path");
requireIfPresent(path.resolve("./plugins"));

app.events.emit('/', 'bootstrap');

function requireIfPresent(moduleDir) {

  if (fs.existsSync(moduleDir)) {
    let subDirs = [];
    console.log("Loading plugins from: " + moduleDir);
    var dirs = fs.readdirSync(moduleDir);
    for (let module of dirs) {
      let modulePath = path.resolve(moduleDir, module);
      if (module.endsWith('.js')) {
        console.log("  Loading plugin: " + module);
        require(modulePath);
      }
      else if (fs.lstatSync(modulePath).isDirectory()) {
        let moduleJsPath = path.resolve(modulePath, module + ".js");
        if (fs.existsSync(moduleJsPath)) {
          console.log("  Loading plugin: " + module);
          require(moduleJsPath);
        }
        else {
          subDirs.push(modulePath)
        }
      }
    }
    for (let modulePath of subDirs) {
      requireIfPresent(modulePath)
    }
  }
}