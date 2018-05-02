const restify = require('restify');
const builder = require('botbuilder');
const https = require('https');
const quiz = require('./quiz');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
    appId:"b5777e0c-bab3-4ada-b81f-8ee1320837b9",
    appPassword:"uqnkAZIS690]@fchIUD84${"
});

server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();


var intentIdentifier = function(session, results) {
    var text = session.message.text; 

    https.get('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/665cf406-6a1a-45b7-862d-d5a139148e58?subscription-key=f10adae4fce74d34b038231802f41a22&verbose=true&timezoneOffset=0&q=' + text, (resp) => {
        let data = '';        
         
        resp.on('data', (chunk) => {
            data += chunk;
        });  

        resp.on('end', () => {
            var topScoringIntent = JSON.parse(data).topScoringIntent.intent;
            if(topScoringIntent == 'Greeting')  session.beginDialog('saudacao');
            else if (topScoringIntent == 'Thanks')  session.beginDialog('adeus');
            else if (topScoringIntent == 'Quiz')  session.beginDialog('quiz');
            else session.beginDialog('none');
        });  
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}


//start no bot
var bot = new builder.UniversalBot(connector, [
    function (session) {        
        intentIdentifier(session, null);
    },
    function (session, results) {  
        if(results && results.response) {    
            intentIdentifier(session, results);
        }
    }
]).set('storage', inMemoryStorage); // Register in-memory storage 

bot.dialog('saudacao', [
    function (session) {    
        builder.Prompts.text(session, "Olá, Bom dia!");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('adeus', [
    function (session) {    
        builder.Prompts.text(session, "Falo maluco!");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('none', [
    function (session) {    
        builder.Prompts.text(session, "Num entendi oq vc falou");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('quiz', quiz.handler);
