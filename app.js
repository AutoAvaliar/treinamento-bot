const restify = require('restify');
const builder = require('botbuilder');
const https = require('https');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
 });

 // Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "450a51ca-0efb-47c4-93d2-c547e9f45e48",//process.env.MicrosoftAppId,
    appPassword: "eqfaMSNC8545(|prqHRB4-{"//process.env.MicrosoftAppPassword
});

server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();

var intentIdentifier = function(session, results) {
    var text = session.message.text;

    https.get('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/665cf406-6a1a-45b7-862d-d5a139148e58?subscription-key=f10adae4fce74d34b038231802f41a22&verbose=true&timezoneOffset=0&q=' + text, (resp) => {
        let data = '';        
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });        
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(data);
            var topScoringIntent = JSON.parse(data).topScoringIntent.intent;
            console.log(topScoringIntent);
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
            console.log("response " + results.response); 
            intentIdentifier(session, results);
        }
    }
]).set('storage', inMemoryStorage); // Register in-memory storage 

//dialog de saudação
bot.dialog('saudacao', [
    function (session) {    
        builder.Prompts.text(session, "Olá, Tudo certo?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

//dialog de quiz
bot.dialog('quiz', [
    function (session) {    
        builder.Prompts.text(session, "Alguma pergunta x?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

//dialog de adeus
bot.dialog('adeus', [
    function (session) {    
        builder.Prompts.text(session, "Adeus");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

//dialog none
bot.dialog('none', [
    function (session) {    
        builder.Prompts.text(session, "Não entendi oq vc quiz dizer");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);