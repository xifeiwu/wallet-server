var config = require("./config");
var path = require('path');
var fs = require('fs');

function route(handle, urlObj, data, response) {
  var pathName = urlObj.pathname;
  switch (pathName){
    case "/login":
      if (data) {
        data = decodeURIComponent(data);
        var obj = {};
        data.split('&').forEach((ele) => {
          var res = ele.split('=');
          obj[res[0]] = res[1];
        });
        console.log(JSON.stringify(obj));
        handle['db']['select'](obj, function(state) {
          responseXHR(response, state);
        });
      } else {
        responseError(response, state);
      }
     break;
    case '/register':
      responseXHR(response, 'works ok.');
      break;
    default:    
      // response.writeHead(404, {'Content-Type': 'text/plain'});
      // response.write("Invalid Call");
      // response.end();
      if (mimeTypesReg.test(pathName) || pathName === '/') {
        loadFile(urlObj, response);
      } else {
        responseError(response, pathName + ' is not found.');
      }
      break;
  }
}
exports.route = route;


function responseXHR(response, content, code) {
  if (!code) {
    code = 200;
  }
  var result = {};
  result.state = content;
  response.writeHead(code, {'Content-Type': 'text/plain'});
  response.write(JSON.stringify(result));
  response.end();
}

function responseError(response, content, code){
  if(!code){
    code = 404;
  }
  var error = new Object();
  error.title = "Error";
  error.content = content;
  response.writeHead(code, {'Content-Type': 'text/plain'});
  response.write(JSON.stringify(error));
  response.end();
}

var mimeTypesReg = /.(html|js|css|png|mp3|ogg|jpg|jpeg|svg|ico|txt)$/;
var mimeTypes = {
     "html": "text/html",
     "js": "application/javascript",
     "css": "text/css",
     "png": "image/png",
     "mp3": "audio/mpeg3",
     "ogg": "audio/mpeg",
     "jpg": "image/jpeg",
     "jpeg": "image/jpeg",
     "svg": "image/svg+xml",
     "ico": "image/x-icon",
     "txt": "text/plain",
};

function loadFile(urlObj, response){
  var pathName = urlObj.pathname;
  if(pathName == "/"){
    pathName = "/index.html"
  }
  var parser = /(.*)\.([a-zA-z]+)/;
  var result = parser.exec(pathName);
  var suffix = result[2];
  var filePath = '';
  if (suffix === 'html') {
    filePath = './static/' + suffix + pathName;
  } else {
    filePath = './static' + pathName;
  }
  fs.exists(filePath, function (exists) {
    if (!exists) {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      response.write("This request URL " + filePath + " was not found on this server.");
      response.end();
    }else {
      fs.readFile(filePath, "binary", function (err, file) {
        if (err) {
          response.writeHead(500, {
              'Content-Type': 'text/plain'
          });
          response.end(err.message);
        } else {
          var content_type;
          switch (suffix) {
            case 'css':
            case 'mp3':
            case 'ogg':
            case 'svg':
            case 'ico':
              content_type = mimeTypes[suffix];
              break;
            case 'js':
              content_type = mimeTypes[suffix];
              break;
            default:
              content_type = 'text/html';
              break;
          }
          response.writeHead(200, {
            'Content-Type': content_type
          });
          if (suffix === 'js' && urlObj.query && 'callback' in urlObj.query) {
            var json = {name: 'test'};
            response.write(urlObj.query.callback + '(' + JSON.stringify(json) + ')', "binary");
          } else {
            response.write(file, "binary");
          }
          response.end();
        }
      });
    }
  });
}
