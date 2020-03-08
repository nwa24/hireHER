// Require Modules
const express = require("express");
const app = express();
const url = require("url");
const fs = require("fs");
const vision = require("@google-cloud/vision");

// const analyzeText = require("./scripts/npl");

const {
    Storage
} = require("@google-cloud/storage");

// Global variables
const storage = new Storage({
    keyFilename: "APIKey.json",
    projectId: "single-howl-270523"
});

async function getTextFromPdf() {
    const client = new vision.ImageAnnotatorClient({
        keyFilename: "APIKey.json"
    });
    const outputPrefix = "pdf_results";
    const bucketName = "hirehertest";
    const fileName = "shorter-file_name.pdf";

    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}`;

    const inputConfig = {
        mimeType: "application/pdf",
        gcsSource: {
            uri: gcsSourceUri
        }
    };

    const outputConfig = {
        gcsDestination: {
            uri: gcsDestinationUri
        }
    };

    const features = [{
        type: "DOCUMENT_TEXT_DETECTION"
    }];
    const request = {
        requests: [{
            inputConfig: inputConfig,
            features: features,
            outputConfig: outputConfig
        }]
    };

    const [operation] = await client.asyncBatchAnnotateFiles(request);
    const [filesResponse] = await operation.promise();
    const destinationUri =
        filesResponse.responses[0].outputConfig.gcsDestination.uri;
    console.log("Json saved to: " + destinationUri);
}

// async function getImageText() {
//     console.log("Get Image")
//     const client = new vision.ImageAnnotatorClient({
//         keyFilename: "APIKey.json"
//     });

//     const bucketName = "hirehertest";
//     const fileName = "test.png";
//     const [result] = await client.textDetection(`gs://${bucketName}/${fileName}`);
//     const detections = result.textAnnotations;
//     fs.writeFile("text.txt", detections[0].description, (err) => {
//         if (err) throw err;
//         console.log("Finishing writting to file")
//     })
// }

// Set the server to listen to 3000
app.listen(3000);

// Setting the homepage -> will display the files from the public folder (index.html)
app.use("/", express.static("public"));

// On Analyze.html when the user clicks the submit button
app.post("/Analyze.html", function (req, res) {
    try {
        // let text = getImageText();
        // fs.writeFile("text.txt", text, (err) => {
        //     if (err) throw err;
        //     console.log("Written file");
        // })
        // res.redirect("/Editor.html");
        // getTextFromPdf();
        // let buff = "";
        // let text = "";
        // storage
        //     .bucket("hirehertest")
        //     .file("pdf_resultsoutput-1-to-1.json")
        //     .createReadStream()
        //     .on("error", function (err) {
        //         return err;
        //     })
        //     .on("data", function (d) {
        //         buff += d;
        //     })
        //     .on("end", function () {
        //         const parsedObject = JSON.parse(buff);
        //         text = parsedObject.responses[0].fullTextAnnotation.text;
        //         text = JSON.stringify(text);
        //         console.log(text);
        //         fs.writeFile("result.json", text, err => {
        //             if (err) throw err;
        //             console.log("Written file");
        //         });
        //         res.redirect("/Editor.html");
        //     });
        res.redirect("/Editor.html")
    } catch (err) {
        console.log(err);
    }
});

app.get("/Editor.html", function (req, res) {
    console.log(req);
});

app.get("/result.json", function (req, res) {});