const fs = require('fs');

// Module variables
var data = {};
var datafile = "";

// Crud API object
var crud = {};

// Create and Save a new Note
crud.create = function(req, res) {
  var jsonString = "";
  
  req.on('data', function(chunk) {
    jsonString += chunk;
  });

  req.on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server Error");
  });

  req.on('end', function(){
    try {
      var course = JSON.parse(jsonString);
      var tokens = course.name.split(" ");
      if(tokens.length < 2) {
        res.statusCode = 422;
        res.end("Poorly formatted course entry");
        return;
      }
      var id = tokens[0] + tokens[1];
      data["courses"][id] = course;
      save();
      res.statusCode = 200;
      res.end(id);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error: " + err);
    }
  });
};

crud.readAll = function(req, res) {
  var courseArr = [];
  var courseObject = data["courses"];

  for(var key in courseObject) {
    courseArr.push(courseObject[key]);
  }
  courseArr = JSON.stringify(courseArr);

  res.statusCode = 200;
  res.end(courseArr);
};

crud.readOne = function(req, res) {
  var id = req.params.id;
  var courseObject = data["courses"];

  var singleObject = JSON.stringify(courseObject[id]);
  
  res.statusCode = 200;
  res.end(singleObject);

};

crud.update = function(req, res) {
  var id = req.params.id;
  data["courses"][id] = req.body;
  save();

  res.statusCode = 200;
  res.end();
};

crud.destroy = function(req, res) {
  var id = req.params.id;

  delete data["courses"][id];
  save();
  
  res.statusCode = 200;
  res.end();
};

/** @function load
  * Loads the persistent data file
  * @param {string} filename - the file to load
  */
function load(filename) {
  datafile = filename;
  data = JSON.parse(fs.readFileSync(filename, {encoding: "utf-8"}));
}

/** @function save
  * Saves the data to the persistent file
  */
function save() {
  fs.writeFileSync(datafile, JSON.stringify(data));
}

/** @module API
  * A module implementing a REST API
  */
module.exports = {
  load: load,
  crud
}
