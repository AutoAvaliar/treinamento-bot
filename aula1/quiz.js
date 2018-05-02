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

function resultadoDoQuiz(session){
    if(session.message.text == "Cruze") conversationQuizPoints += 1;
    
    session.send("Você acertou " + conversationQuizPoints + " de 1")
    disposeDialog(session);
}

function disposeDialog(session){
    conversationQuizStatus = 0;
    conversationQuizPoints = 0;
    session.endDialogWithResult(false);
}

exports.handler = function (session) {  
    if(conversationQuizStatus == 0) primeiraPergunta(session)
    else resultadoDoQuiz(session)
}