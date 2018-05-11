const app = require('app');
const argv = require('minimist')(process.argv.slice(2));

const proxies = [];

async function initialize() {
  var root = argv.runtime;
  var rootProxy = app.proxyFactory.fs.create({fs: root, root: "/"});
  var config = rootProxy.getJson("/_virtualFileSystem.settings");
  var proxyDetails = config.proxies;
  for (let i = 0; i < proxyDetails.length; i++) {
    var proxySettings = proxyDetails[i];
    if (proxySettings.fs) {
      let proxy = app.proxyFactory.fs.create(proxySettings);
      proxies.push(proxy);
    }
  }
  proxies.sort((p1, p2) => p1.root.localeCompare(p2.root) * -1);
  proxies.push(rootProxy);
  emit("/", "fsLoaded");
}

function proxyFor(path) {
  for (let proxy of proxies) {
    if (path === proxy.root || path.startsWith(proxy.rootPrefix)) {
      return proxy;
    }
  }
}


app.fs = {
  get: (path) => proxyFor(path).get(path),
  getAsString:(path) => proxyFor(path).getAsString(path),
  getJSON: (path) => proxyFor(path).getJSON(path),
  list: (path) => proxyFor(path).list(path),
  createWriteStream: (path) => proxyFor(path).createWriteStream(path)
};