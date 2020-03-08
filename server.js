// Require Modules
const express = require("express");
const app = express();
const url = require("url")
const fs = require("fs");

const {
    Storage
} = require("@google-cloud/storage");

// Global variables
const storage = new Storage({
    keyFilename: "APIKey.json",
    projectId: "single-howl-270523"
});


// Set the server to listen to 3000
app.listen(3000);

// Setting the homepage -> will display the files from the public folder (index.html)
app.use("/", express.static("public"));

// On Analyze.html when the user clicks the submit button
app.post("/Analyze.html", function (req, res) {
    try {
        let buff = '';
        let text = '';
        storage.bucket("hirehertest").file("pdf_resultsoutput-1-to-1.json").createReadStream()
            .on('error', function (err) {
                return (err)
            })
            .on('data', function (d) {
                buff += d
            })
            .on('end', function () {
                const parsedObject = JSON.parse(buff);
                text = parsedObject.responses[0].fullTextAnnotation.text;
                text = JSON.stringify(text);
                fs.writeFile("result.json", text, (err) => {
                    if (err) throw err;
                    console.log("Written file");
                })
                res.redirect("/Editor.html");
            })
    } catch (err) {
        console.log(err);
    }
});

app.get("/Editor.html", function (req, res) {
    console.log(req);
})

app.get("/result.json", function (req, res) {})