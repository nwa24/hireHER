// Require Modules
const express = require("express");
const app = express();
const url = require("url");
const fs = require("fs");
const vision = require("@google-cloud/vision");
const fileUpload = require("express-fileupload");
const npl = require("./scripts/npl");

// default options
app.use(fileUpload());

// Global variables
const {
    Storage
} = require("@google-cloud/storage");

const storage = new Storage({
    keyFilename: "APIKey.json",
    projectId: "single-howl-270523"
});

const bucketName = "hirehertest";

// Functions
async function uploadToStorage(filePath, fileName) {
    console.log(filePath);

    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filePath, {});

    console.log("Uploaded to Google Cloud Storage");

    getTextFromPdf(fileName);
}

async function getTextFromPdf(fileName) {
    const client = new vision.ImageAnnotatorClient({
        keyFilename: "APIKey.json"
    });
    const outputPrefix = "results";
    // const fileName = "shorter-file_name.pdf";

    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}`;

    console.log(gcsSourceUri);

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

    downloadJson();
}

function downloadJson() {
    let buff = "";
    let text = "";
    storage
        .bucket("hirehertest")
        .file("resultsoutput-1-to-1.json")
        .createReadStream()
        .on("error", function (err) {
            return err;
        })
        .on("data", function (d) {
            buff += d;
        })
        .on("end", function () {
            const parsedObject = JSON.parse(buff);
            text = parsedObject.responses[0].fullTextAnnotation.text;
            let results = {
                text: [text],
                keywords: ["challenge", "boss", "decisive", "leader"]
            };
            results = JSON.stringify(results);
            fs.writeFile(__dirname + "/public/result.json", results, 'utf8', err => {
                if (err) throw err;
                console.log("Written file");
            });
        });
}

// Set the server to listen to 3000
app.listen(3000);

// Setting the homepage -> will display the files from the public folder (index.html)
app.use("/", express.static("public"));

// On Analyze.html when the user clicks the submit button
app.post("/Analyze.html", function (req, res) {
    try {
        // Uploading file to local server
        console.log(req.files);
        let file = req.files.filename;
        let fileName = req.files.filename.name;
        let filePath = __dirname + "/pdfFiles/" + fileName;

        file.mv(filePath, function (err) {
            if (err) throw err;
            console.log("File Uploaded to Folder");
        });

        // Upload File to Google Cloud Storage
        uploadToStorage(filePath, fileName);

        setTimeout(function () {
            res.redirect("/Editor.html");
        }, 18000);

        // uploadToStorage(filePath, fileName);

        // Redirect the page after to show the results
    } catch (err) {
        console.log(err);
    }
});

app.get("/Editor.html", function (req, res) {
    console.log(req);
});

app.get("/result.json", function (req, res) {});