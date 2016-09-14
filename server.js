var http = require("http");
var url = require("url");
var fs = require('fs');
var util = require('util');
var cp = require('child_process');
var config = require("./config");
var now= new Date();


function start(route, handle) {
  function onRequest(request, response) {
    showRequest(request);
    console.log(request.headers);
    var urlObj = parseRequest(request.url);
    console.log("In Server.js, Request for: " + JSON.stringify(urlObj));
    request.setEncoding("utf8");

    var postData = "";
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("In Server.js, postDataChunk: '"+ postDataChunk + "'.");
    });
    request.addListener("end", function() {
      console.log("In Server.js, postData: '"+ postData + "'.");
      route(handle, urlObj, postData, response);
    });
    request.on('error', function(err) {
      console.error(err.stack);
    });
  }
  var server = http.createServer(onRequest);
  server.listen(config.HTTPPORT);
  console.log("Server has started at port: " + config.HTTPPORT);
}

exports.start = start;

function parseRequest(urlString) {
  var obj = url.parse(urlString);
  if (obj.query) {
    obj.query = parseQueryString(obj.query);
  }
  return obj;
}

function parseQueryString(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!obj.hasOwnProperty(k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}

function showRequest(request) {
  var forbidden = [];
  var allowed = ['/'];
  var url = request.url;
  // in forbidden, or not in allowed.
  if ((forbidden.indexOf(url) !== -1) || (allowed.indexOf(url) === -1)) {
    return;
  }
  console.log('==========' + url + '==========');
  console.log(request.url);
  console.log(request.method);
  console.log(request.headers);
}
