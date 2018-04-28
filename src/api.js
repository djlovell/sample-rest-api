/**
* api.js
* 
* RESTful API for interacting with a JSON backend
*  
* @author Nathan Bean, Daniel Lovell
* @version 2.0
*/

const fs = require('fs');

/* Module variables */
var data = {};
var datafile = "";

/* CRUD API object */
var crud = {};

/** @function create
  * This API function creates a new JSON course
  * object from the request body.
  * @param {http.clientRequest} req - the incoming request
  * @param {http.serverResponse} res - the response to serve
  */
crud.create = function(req, res) {
  try {
    var course = req.body;
    var value = course["name"];
    var tokens = value.split(" ");
    
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
  } 
  catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end("Server Error: " + err);
  }
}

/** @function readAll
  * This API function returns a JSON array
  * containing all course entries.
  * @param {http.clientRequest} req - the incoming request
  * @param {http.serverResponse} res - the response to serve
  */
crud.readAll = function(req, res) {
  try {
    var courseArr = [];
    var courseObject = data["courses"];

    for(var key in courseObject) {
      courseArr.push(courseObject[key]);
    }
    courseArr = JSON.stringify(courseArr);

    res.statusCode = 200;
    res.end(courseArr);
  } 
  catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end("Server Error: " + err);
  }
};

/** @function readOne
  * This API function returns a JSON array
  * containing a specified course entry.
  * @param {http.clientRequest} req - the incoming request
  * @param {http.serverResponse} res - the response to serve
  */
crud.readOne = function(req, res) {
  try {
    var id = req.params.id;
    var courseObject = data["courses"];

    var singleObject = JSON.stringify(courseObject[id]);
    
    res.statusCode = 200;
    res.end(singleObject); 
  } 
  catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end("Server Error: " + err);
  }
};

/** @function update
  * This API function updates the course JSON object
  * containing the specified course entry.
  * @param {http.clientRequest} req - the incoming request
  * @param {http.serverResponse} res - the response to serve
  */
crud.update = function(req, res) {
  try {
    var id = req.params.id;

    data["courses"][id] = req.body;
    save();
  
    res.statusCode = 200;
    res.end();
  } 
  catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end("Server Error: " + err);
  }
};

/** @function destroy
  * This API function removes the specified course entry.
  * @param {http.clientRequest} req - the incoming request
  * @param {http.serverResponse} res - the response to serve
  */
crud.destroy = function(req, res) {
  try {
    var id = req.params.id;

    delete data["courses"][id];
    save();

    res.statusCode = 200;
    res.end();
  } 
  catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end("Server Error: " + err);
  }
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
