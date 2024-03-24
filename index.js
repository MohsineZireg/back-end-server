const express = require('express');
const multer = require('multer');
const app = express();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let allMsgs = [];
let idCount = 0;

// Generate and return a new client ID
app.get("/clientId/new", function(req, res) {
  const clientId = getNewClientId();
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

// Get a specific message by its index
app.get("/msg/get/:msgNumber", function(req, res) {
  const msgNumber = parseInt(req.params.msgNumber);
  if (!isNaN(msgNumber) && msgNumber >= 0 && msgNumber < allMsgs.length) {
    res.json({ "code": 1, "msg": allMsgs[msgNumber] });
  } else {
    res.json({ "code": 0 });
  }
});

// Get the number of messages
app.get("/msg/nber", function(req, res) {
  res.json(allMsgs.length);
});

// Get all messages
app.get("/msg/getAll", function(req, res) {
  res.json(allMsgs);
});

// Delete a specific message by its index
app.get("/msg/del/:messageNumber", function(req, res) {
  const messageNumber = parseInt(req.params.messageNumber);
  if (!isNaN(messageNumber) && messageNumber >= 0 && messageNumber < allMsgs.length) {
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

// Post a message (including pictures)
app.post("/msg/post/:clientId", upload.single('picture'), function(req, res) {
  const newMessage = req.body.message; // Text message
  const clientId = parseInt(req.params.clientId);

  // Check if clientId is valid
  if (!isNaN(clientId) && clientId >= 0) {
    const messageData = { "clientId": clientId };

    // Check if a picture was uploaded
    if (req.file) {
      // If a picture was uploaded, store its file path
      messageData.picture = req.file.path;
    }

    // If text message or picture is provided, store them
    if (newMessage || messageData.picture) {
      if (newMessage) messageData.message = newMessage;
      allMsgs.push(messageData);
      res.json({ "code": 1, "msgNumber": allMsgs.length - 1 });
    } else {
      res.json({ "code": 0, "error": "No message or picture provided" });
    }
  } else {
    res.json({ "code": 0, "error": "Invalid client ID" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
