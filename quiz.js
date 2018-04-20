const builder = require('botbuilder');

var conversationQuizStatus = 0;
var conversationQuizPoints = 0;

function primeiraPergunta(session){
    session.send("Vamos ver quanto você sabe sobre carros:")
    
    var msg = new builder.Message(session)
    .text("Qual carro foi criado pela Chevrolet para substituir o Astra?")
    .suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Spin", "Spin"),
                    builder.CardAction.imBack(session, "Cobalt", "Cobalt"),
                    builder.CardAction.imBack(session, "Classic", "Classic"),
                    builder.CardAction.imBack(session, "Cruze", "Cruze")
                ]
            ));
    session.send(msg);
    conversationQuizStatus = 1;
}

function segundaPergunta(session){
    if(session.message.text == "Cruze") conversationQuizPoints += 1;
    
    var msg = new builder.Message(session)
    .text("Qual dos carros abaixo foi o último modelo da Fiat a ser criado?")
    .suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Mobi", "Mobi"),
                    builder.CardAction.imBack(session, "Linea", "Linea"),
                    builder.CardAction.imBack(session, "Palio", "Palio"),
                    builder.CardAction.imBack(session, "Cronos", "Cronos")
                ]
            ));
    session.send(msg);    
    conversationQuizStatus = 2;
}

function terceiraPergunta(session){
    if(session.message.text == "Cronos") conversationQuizPoints += 1;

    var msg = new builder.Message(session)
    .text("Qual o primeiro carro a ter um motor rodando com etanol?")
    .suggestedActions(builder.SuggestedActions.create(
                session, [
                    builder.CardAction.imBack(session, "Corcel", "Corcel"),
                    builder.CardAction.imBack(session, "Fusca", "Fusca"),
                    builder.CardAction.imBack(session, "Chevete", "Chevete"),
                    builder.CardAction.imBack(session, "Kombi", "Kombi")
                ]
            ));
    session.send(msg);
    conversationQuizStatus = 3;
}

function resultadoDoQuiz(session){
    if(session.message.text == "Corcel") conversationQuizPoints += 1;
    
    session.send("Você acertou " + conversationQuizPoints + " de 3")
    disposeDialog();
}

function disposeDialog(){
    conversationQuizStatus = 0;
    conversationQuizPoints = 0;
    session.endDialogWithResult(false);
}

exports.handler = function (session) {  
    console.log(conversationQuizStatus);
    if(conversationQuizStatus == 0) primeiraPergunta(session)    
    else if(conversationQuizStatus == 1) segundaPergunta(session)
    else if(conversationQuizStatus == 2) terceiraPergunta(session)
    else resultadoDoQuiz(session)
}