var http = require('http');
var app = require('app');
var constants = require('constants');
var REST = require('rest');

/**
 *
 * @param {http.ClientRequest} request
 * @param {ServerResponse} response
 */
async function requestHandler(request, response) {
  try {
    let result = await REST.get(request.url);
    response.writeHead(200, {
      'Content-Type': result[constants.mimetype]
    });
  
    if (result.stream) {
      result.stream().on("error", (e) => response.writeHead(404, e.message)).pipe(response);
    }
    else if (result.string) {
      response.end(result.string());
    }
    else if (result.json) {
      response.end(JSON.stringify(result.json(), null, 2));
    }
  }
  catch (e) {
    console.log(e.message);
    response.writeHead(404, e.message);
    response.end("");
  }
}

function start() {
  http.createServer(requestHandler).listen(80, "");
}

app.events.on("/", "appStarted", start);

