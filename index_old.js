var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", function(req, res) {
  res.send("Hello")
})

// app.get("/test/*", function(req, res) {
//   // Extracting the variable part of the path
//   const dynamicParam = req.params[0];

//   // Building the HTTP response
//   const responseText = `You accessed the /test/ route with parameter: ${dynamicParam}`;

//   // Sending the response
//   res.send(responseText);
// });
app.get('/test/*', function(req, res) {
    // Extracting the dynamic part of the URL using substring
    const dynamicParam = req.url.substr('/test/'.length);

    // Constructing the response object
    const responseObject = {"msg": dynamicParam};

    // Sending the response as JSON
    res.json(responseObject);
});


// Initialize the counter state
var counter = 0;

// Route to query the counter value
app.get('/cpt/query', function(req, res) {
    // Respond with JSON containing the current counter value
    res.json({"value": counter});
});

// Route to increment the counter by a specified value
app.get('/cpt/inc', function(req, res) {
    // Extract the value parameter from the query string
    const valueParam = parseInt(req.query.v);

    if (req.query.v === undefined) {
        // Increment the counter by 1 if no value parameter is passed
        counter++;
        // Respond with JSON containing the updated counter value
        return res.json({"code" : 0});
    }

    // Check if valueParam is a valid integer
    else if (!isNaN(valueParam)) {
        // Increment the counter by the specified value
        counter += valueParam;
        // Respond with JSON containing the updated counter value
        return res.json({"code" : 0});
    } else {
        // Respond with JSON indicating failure due to invalid parameter
        return res.json({"code": -1});
    }
});

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

