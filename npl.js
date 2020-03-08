const csv = require("csv");
const http = require("http");
const obj = csv();
const jobDesc =
  "XYZ provides online software and services for gaming. We design, develop, and host services for some of the world's biggest game franchises. We are a technology-driven company with a commitment to openness and independence. This means collaborating to solve analytical problems, the freedom to talk to anyone, and the best idea wins. We solve tough problems on a day to day basis, and our outspoken interns have a big impact on what we do. We've had ambitious interns commit code and have it running in production within the first three days of joining. We take the work seriously; ourselves, not so much. We dress casually, we have flexible hours, we’re rockstar and we have kickass coffee.\n";

var natural = require("natural");
var classifier = new natural.BayesClassifier();
var tokenizer = new natural.WordTokenizer();

var MaleData = [];
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

classifier.events.on("doneTraining", () => {
  var tokenArray = tokenizeText(jobDesc);
  for (var i = 0; i < tokenArray.length; i++) {
    var token = tokenArray[i];
    if (classifier.classify(token) == "Male") {
      tokenList.push(token);
      count++;
    }
  }
  console.log(count);
  console.log(tokenList);
});

var count = 0;
var tokenList = [];
var totalWordCount = 0;

tokenizeText = textString => {
  return tokenizer.tokenize(textString);
};

returnCount = () => {
  return count;
};

// module.exports = {
//     analyzeText: analyzeText(jobDesc)
// };
