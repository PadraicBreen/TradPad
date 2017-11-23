
var http = require('http');
var finder = require('Finder');
var webserver = require('WebServer');
var types = require('Types');

console.log(require.resolve("minimist"));
var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
var a1 = [9,2,3];
var a2 = [...a1,1,10,4,6,3,4,5]
console.log([...(new Set(a2))].sort((a,b)=>a-b));
console.log();
console.log("================================================");
types.load();
finder.start("../Runtimes/Version1");
webserver.start();