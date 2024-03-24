var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var allMsgs = []//["Hello World1", "foobar", "CentraleSupelec Forever"];
var idCount = 0;

// API endpoint to generate and return a new client ID
app.get("/clientId/new", function(req, res) {
  var clientId = getNewClientId();
  if (clientId !== null) {
    res.json({ "code": 1, "clientId": clientId });
  } else {
    res.json({ "code": 0, "error": "Failed to generate client ID" });
  }
});

function getNewClientId() {
  return idCount++;
}

app.get("/", function(req, res) {
  res.send("Hello");
});

app.get("/msg/get/:msgNumber", function(req, res) {
  var msgNumber = parseInt(req.params.msgNumber);
  if (!isNaN(msgNumber) && msgNumber >= 0 && msgNumber < allMsgs.length) {
    res.json({ "code": 1, "msg": allMsgs[msgNumber] });
  } else {
    res.json({ "code": 0 });
  }
});

app.get("/msg/nber", function(req, res) {
  res.json(allMsgs.length);
});

app.get("/msg/getAll", function(req, res) {
  res.json(allMsgs);
});

// Delete a specific message by its index
app.get("/msg/del/:messageNumber", function(req, res) {
  var messageNumber = parseInt(req.params.messageNumber);
  if (!isNaN(messageNumber) && messageNumber >= 0 && messageNumber < allMsgs.length) {
    // Remove the message at the specified index
    allMsgs.splice(messageNumber, 1);
    res.json({ "code": 1, "message": "Message deleted successfully" });
  } else {
    res.json({ "code": 0, "error": "Invalid message number" });
  }
});

// Delete all messages
app.get("/msg/delAll", function(req, res) {
  allMsgs = []; // Empty the array
  res.json({ "code": 1, "message": "All messages deleted successfully" });
});

app.get("/msg/post/:newMessage/:clientId", function(req, res) {
  var newMessage = unescape(req.params.newMessage);
  var clientId = parseInt(req.params.clientId);

  // Check if clientId is valid
  if (!isNaN(clientId) && clientId >= 0) {
    // Push the message along with the clientId to allMsgs
    allMsgs.push({ "clientId": clientId, "message": newMessage });
    res.json({ "code": 1, "msgNumber": allMsgs.length - 1 });
  } else {
    res.json({ "code": 0, "error": "Invalid client ID" });
  }
});

app.listen(8080);
console.log("App listening on port 8080...");
