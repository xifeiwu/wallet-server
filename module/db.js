var sqlite3 = require('sqlite3');
var config = require('../config')
var mydb;
function getDB(){
  if(!mydb){
    try{
      mydb = new sqlite3.Database(config.DBFILE);
    }catch(e){
      config.log("Error in module/db.js: init mydb fail.", "error");
      return;
    }
  }
  return mydb;
}

function closeDB(callback){
  if(mydb){
    mydb.close(callback);
  }else{
    callback();
  }
}

function runSQL(sql,callback){
  var result = getDB().run(sql, function(err){
    if(err){
      callback(false);
    }else{
      callback(true);
    }
  });
}

function select(info, cb) {
  var name = info.name;
  var password = info.password;
  if (!name || !password) {
    return cb(false);
  }
  var sql = "select * from user where name='" + name  + "' and password='" + password + "'";
  getDB().all(sql, function(err, rows) {
    if (err) {
      return cb(false);
    }
    if (rows.length > 0) {
      cb(true);
    } else {
      cb(false);
    }
  });
}

exports.select = select;

function insert(name, password){
  var sql = "INSERT INTO user VALUES(null, '"
   + name + "', '"
   + password +"')";
  runSQL(sql, function(state){
    //console.log(sql + ". state: " + state);
    cb(state);
  });
}
exports.insert = insert;
