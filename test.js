const csv = require('csv');
const http = require('http');
const obj = csv();
const jobDesc = "Company: XYZ Job Title: Software Development Co-op Duration: 4 or 8 months\nJob Description: The Company XYZ provides online software and services for gaming. We design, develop, and host services for some of the world's biggest video game franchises. We are a technology-driven company with a commitment to openness and independence. This means collaborating to solve problems, the freedom to talk to anyone, and the best idea wins. We take the work seriously; ourselves, not so much. We have offices in Dublin, Ireland; Vancouver, Canada; and Shanghai, China.\nBig company challenges, active* company culture\nXYZ hosts millions of concurrently connected users. Technologies we use but not limited to are Python, Linux, MySQL, C++, and Erlang. We solve tough problems on a day to day basis, and our outspoken interns have a big impact on what we do. We've had ambitious interns commit code and have it running in production within the first three days of joining. We also like to have fun while we're working hard. We dress casually, we have flexible hours, we’re rockstars and we have kickass coffee.\nThe Role ● Helping game studios integrate multiplayer features ● Developing plugins and extending our automation framework ● Developing core features for our allocation and provisioning systems ● Creating tools to automate all the things!\nWe're open to work terms of 4, 8, 12, or 16 months. Generally, the longer the term, the more in-depth the experience.\nJob Requirements: ● Excellent programming skills ● A good grasp of fundamental algorithms and data structures ● Familiarity with Linux and source control (git preferred) ● Excellent debugging and analytical skills ● Can identify complex problems and find simple solutions ● Can clearly and confidently communicate technical concepts in plain English\nNice-to-haves ● Understanding of SQL based databases (MySQL preferred) ● Knowledge of networking technologies, e.g. TCP, UDP ● Experience with multi-platform software development ● Experience with security and scalability ● Experience developing REST web services\n"

var natural = require('natural');
var classifier = new natural.BayesClassifier();
var tokenizer = new natural.WordTokenizer();

var MaleData = [];

obj.from.path('/Users/sharonhe/Desktop/nlp-node-natural-article-master/src/MaleOriented.csv').to.array(function (data) {
    for (var index = 0; index < data.length; index++) {
        MaleData.push(data[index][0]);
    }
    for(var i = 0; i < MaleData.length; i++) {
        classifier.addDocument('qqq', 'Other');
        classifier.addDocument(MaleData[i], 'Male');
    }

    classifier.train();
});

classifier.events.on('doneTraining', () => {
    var tokenArray = tokenizeText(jobDesc);
    for(var i = 0; i < tokenArray.length; i++) {
        var token = tokenArray[i];
        if(classifier.classify(token) == 'Male') {
            count++;
        };
    }
    console.log(count);
});

var count = 0;

tokenizeText = textString => {
    return tokenizer.tokenize(textString);
};

returnCount = () => {
    return count;
};
