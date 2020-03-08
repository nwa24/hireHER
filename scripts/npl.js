const csv = require("csv");
const http = require("http");
const obj = csv();
// const jobDesc =
//   "XYZ provides online software and services for gaming. We design, develop, and host services for some of the world's biggest game franchises. We are a technology-driven company with a commitment to openness and independence. This means collaborating to solve analytical problems, the freedom to talk to anyone, and the best idea wins. We solve tough problems on a day to day basis, and our outspoken interns have a big impact on what we do. We've had ambitious interns commit code and have it running in production within the first three days of joining. We take the work seriously; ourselves, not so much. We dress casually, we have flexible hours, we’re rockstar and we have kickass coffee.\n";

var natural = require("natural");
var classifier = new natural.BayesClassifier();
var tokenizer = new natural.WordTokenizer();

function npl(jobDesc) {
  var MaleData = [];
  var totalWordCount = 0;
  var keywords;

  obj.from.path("public/csv/MaleOriented.csv").to.array(function(data) {
    for (var index = 0; index < data.length; index++) {
      MaleData.push(data[index][0]);
    }
    for (var i = 0; i < MaleData.length; i++) {
      classifier.addDocument("qqq", "Other");
      classifier.addDocument(MaleData[i], "Male");
    }

    classifier.train();
  });

  classifier.events.on("doneTraining", function() {
    analyzeText(classifier, jobDesc);
  });
}

function tokenizeText(textString) {
  return tokenizer.tokenize(textString);
}

function analyzeText(classifier, jobDesc) {
  var tokenArray = tokenizeText(jobDesc);
  var keywords = [];
  var count = 0;
  for (var i = 0; i < tokenArray.length; i++) {
    var token = tokenArray[i];
    if (classifier.classify(token) == "Male") {
      keywords.push(token);
      count++;
    }
  }

  console.log(keywords);

  return keywords;
}

exports.npl = npl;
