// Require modules
const vision = require("@google-cloud/vision");
const {
    Storage
} = require("@google-cloud/storage");

// Global variables
const storage = new Storage({
    keyFilename: "APIKey.json",
    projectId: "single-howl-270523"
});

const bucketName = "hirehertest";
const fileName = "file_name.pdf";

/**
 * Detects the text within the PDF stored in Google Cloud Bucket and returns a JSON file that is returned to the Google Cloud Bucket
 */
async function getTextFromPdf() {
    const client = new vision.ImageAnnotatorClient({
        keyFilename: "APIKey.json"
    });
    const outputPrefix = "pdf_results";

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

// async function listBuckets() {
//   const [buckets] = await storage.getBuckets();
//   //   console.log("buckets");
//   console.log(buckets);
//   buckets.forEach(bucket => {
//     console.log(bucket.name);
//   });
// }

// listBuckets().catch(console.error);



// async function quickStart() {
//   const client = new vision.ImageAnnotatorClient({
//     keyFilename: "APIKey.json"
//   });

//   const [result] = await client.labelDetection("./test.jpeg");
//   const labels = result.labelAnnotations;
//   console.log("labels: ");
//   labels.forEach(label => console.log(label.description));
// }