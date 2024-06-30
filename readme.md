# Integration Whatsapp Messenger API

## Useful links
- [Whatsapp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)  
- [Get Started for Tech Providers](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started-for-tech-providers#get-started-for-tech-providers)


## 1) Request advanced access for permissions
```
whatsapp_business_management
```
&
```
whatsapp_business_messaging
```

## 2) Set a webhook
To create a webhook you shound navigate to Application panel and add **Whatsapp**.  
Webhooks is neccessary to receive and send messages.  
Them move to Whatsapp -> Configuration -> Webhook section
Your configuration should looks like:  
URL: https://your_webhook_name/webhook  
Access token: hello  
Before clicking save button make sure that you webhook is running otherwise you will get errors.  
If everything was correct in your server console where webhook is running you will get the message such as WEBHOOK_VERIFIED  
After you need to subscribe to 'messsages' field to be able to send and receive messages.   
In my server.js already provided sample of webhook that will auto reply to incoming messages.  
## 3) Send a message
We need ACCESS_TOKEN and recipient number for sending a message  
This is a curl post request for sending a message  

```
curl --location '`' \
--header 'Authorization: {ACCESS_TOKEN}' \
--header 'Content-Type: application/json' \
--data '{ \"messaging_product\": \"whatsapp\", \"to\": \"787779537464\", \"type\": \"template\", \"template\": { \"name\": \"hello_world\", \"language\": { \"code\": \"en_US\" } } }'
```


## 4) Adding Sign In via Facebook with assosiated whatsapp business account

You need to add new login configuration and choose the Embedded Sign Up in Whatsapp. Make sure that you already have permissions from the first step. After creating new config you will get your 'config_id'. 

After that include neccessary scripts for you web app code and set config_id inside script.
Part of code that should include config_id:
```
 function launchWhatsAppSignup() {
            FB.login(function (response) {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            }, {
                config_id: 'CONFIG_ID', // configuration ID obtained in the previous step goes here
                response_type: 'code',     // must be set to 'code' for System User access token
                override_default_response_type: true,
                extras: {
                    setup: {
                    }
                }
            });
        }
```


