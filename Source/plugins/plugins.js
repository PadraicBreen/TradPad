/* global __dirname */

var path = require("path");
var fs = require("fs");

var module_dir = path.resolve(__dirname, "node_modules");
var dirs = fs.readdirSync(module_dir);
for (let module of dirs) {
  module = module.toLowerCase()
  console.log("  Loading Module: " + module);
  exports[module] = require(module);
}