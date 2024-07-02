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



app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});


app.post("/webhook", async (req, res) => {
  let body = req.body;
  console.log("Body")

  console.log(body)
  console.log('-----')
  console.log(body.entry[0].changes[0])
  if (req.body.entry[0].changes[0].value.messages) { // if user texted
    console.log("Message: " + req.body.entry[0].changes[0].value.messages[0].text.body) // text of message
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
      console.log(JSON.parse(response.body));
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
    console.log("Access token: " + JSON.parse(response.body).access_token);
    

    getWABAId(JSON.parse(response.body).access_token, function () {

    });
    res.send(JSON.parse(response.body))

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

    console.log(JSON.parse(response.body));
    res.send(JSON.parse(response.body))
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


function getWABAId(user_access_token, cb) {
  var options = {
    'method': 'GET',
    'url': `https://graph.facebook.com/v16.0/debug_token?input_token=${user_access_token}&access_token=1588305461280187|RvuZimhPjKWiGhSpypFyxHUxwBM`,
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log("getWABAId");

    console.log(JSON.parse(response.body));
    getWPPhoneNumberId(user_access_token, JSON.parse(response.body).data.granular_scopes[1].target_ids[0], function () {

    })
  });
}


function getWPPhoneNumberId(user_access_token, waba_id, cb) {
  var options = {
    'method': 'GET',
    'url': `https://graph.facebook.com/v16.0/${waba_id}/phone_numbers?access_token=${user_access_token}`,
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log("getWPPhoneNumberId");
    console.log(JSON.parse(response.body));
    registerPhoneNumber(JSON.parse(response.body).data[0].id, user_access_token)
  });
}

function registerPhoneNumber(phone_number_id, user_access_token) {
  var options = {
    'method': 'POST',
    'url': `https://graph.facebook.com/v16.0/${phone_number_id}/register?messaging_product=whatsapp&pin=123456&access_token=${user_access_token}`,
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log("registerPhoneNumber");
    console.log(response.body);
  });
}

function setWebhook(waba_id, user_access_token){
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': `https://graph.facebook.com/v20.0/${waba_id}/subscribed_apps`,
    'headers': {
      'Authorization': `Bearer ${user_access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "override_callback_uri": "https://c10.webapi.ai/whatsapp/webhook",
      "verify_token": "6v0xt4vi"
    })

  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });

}



run_mode = args[1];



if (run_mode == 2) {

  var server = http.createServer(app);
  var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/coachmate.kz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/coachmate.kz/fullchain.pem')
  }

  https.createServer(options, app).listen(443, () => {
    console.log('App listening on port 443!');
  });

  app.listen(80, (req, res) => {
    console.log('local started')
  });

} else {
  var server = http.createServer(app);
  server.listen(4000);
  console.log(`App is listening at host http://localhost:${4000}`);

}