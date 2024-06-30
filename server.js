const request = require("request");
const express = require("express");
const body_parser = require("body-parser");
var args = process.argv.slice(2);
config = args[0];
run_mode = args[1];
const app = express();
const path = require('path');
var http = require("http");
var https = require('https');
var fs = require("fs");
var user_token;
var page_id;
var access_token;
var last_recipient;

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});


app.post("/webhook", async (req, res) => {
  let body = req.body;
  console.log(req.body.entry[0].changes[0].value) // main object
  if (req.body.entry[0].changes[0].value.messages) { // if user texted
    console.log(req.body.entry[0].changes[0].value.messages[0].text.body) // text of message
    console.log(req.body.entry[0].changes[0].value.messages[0].from) // sender
    var options = {
      'method': 'POST',
      'url': 'https://graph.facebook.com/v18.0/101441162720915/messages',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAWkji7QfbsBO6sYfYOnGD52OUMOt5nAdWPfvDqAKfqzvOBevoI6sDaO1CPoIWnrmsIEyreGqTrw7P1lZAugVEl8iU9qn3EYoMgBZCkMsiSQMW1sNS8Q2mmUPKkbkHZA0nMbgO8ZBrpFZARC5ZAukVYxtoCWnJNktZAFS0EqCzdqRycLwp2nktAFnmYlaXg0ZAJZAwkTBVaAJCKE5ekQObAcz0q3rzZCEZD'
      },
      body: JSON.stringify({
        "messaging_product": "whatsapp",
        "to": "787779537464",
        "type": "template",
        "template": {
          "name": "hello_world",
          "language": {
            "code": "en_US"
          }
        }
      })

    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });


  }
  res.sendStatus(200);

});

app.get('/access_token', (req, res) => {
  const code = req.query.code;
  var client_id = '1588305461280187';
  var client_secret = 'b5e21683dc42b83209b15ff95d941a32'
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send(response.body)

  });

});


app.get('/get_wb_data', (req, res) => {
  var request = require('request');
  var access_token = req.query.access_token
  var options = {
    'method': 'GET',
    'url': 'https://graph.facebook.com/v19.0/debug_token?input_token=' + access_token,
    'headers': {
      'Authorization': 'Bearer ' + access_token
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.send(response.body)
  });
 
})

app.get("/webhook", (req, res) => {
  const verify_token = "hello";
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {

    if (mode === "subscribe" && token === verify_token) {

      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {

      res.sendStatus(403);
    }
  }
});



let port = 4000 || process.env.PORT;

run_mode = args[1];



if(run_mode == 2){

  var server = http.createServer(app);
  var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/coachmate.kz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/coachmate.kz/fullchain.pem')
  }

  https.createServer(options, app).listen(443, () => {
    console.log('App listening on port 443!');
  });

  app.listen(80, (req,res)=>{
  console.log('local started')
  });

} else {
  var server = http.createServer(app);
  server.listen(4000);
  console.log(`App is listening at host http://localhost:${4000}`);

}