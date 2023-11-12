/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import puppeteer from "puppeteer";
// import { Storage } from "@google-cloud/storage";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

functions.setGlobalOptions({
  memory: "1GiB",
  concurrency: 1000,
  invoker: "public",
});

export const helloWorld = onRequest(async (request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  logger.debug(request);

  const reqUrl = "https://www.anime-chiikawa.jp/";

  console.log(reqUrl);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  console.log("Fetching url: " + reqUrl);
  await page.goto(reqUrl, {
    waitUntil: "networkidle0",
  });

  const source = await page.content();
  console.log(source);

  // await writeToGcs(
  //   "synapse-genius-dev-fbe11.appspot.com",
  //   "websiteHtml/chiikawa.html",
  //   source,
  //   page.url()
  // );

  const srcAll = await page.$$eval("img", (list) => list.map((el) => el.src));
  console.log(srcAll);

  await browser.close();
  console.log("complete puppeteer requests");
  response.send("hellow crawler");
});

// async function writeToGcs(
//   bucketName: string,
//   filename: string,
//   content: string,
//   pageUrl: string
// ) {
//   const gcs = new Storage();
//   const bucket = gcs.bucket(bucketName);
//   const file = bucket.file(filename);
//   const gcsFilename = `gs://${bucket.name}/${file.name}`;
//   const options = createUploadOptions("text/html", pageUrl);

//   const stream = file.createWriteStream(options);
//   return new Promise((resolve, reject) => {
//     stream.end(content);
//     stream.on("error", (err) => {
//       console.error("Error writing GCS file: " + err);
//       reject(err);
//     });
//     stream.on("finish", () => {
//       console.log("Created object: " + gcsFilename);
//       resolve(200);
//     });
//   });
// }

// function createUploadOptions(contentType: string, url: string) {
//   return {
//     resumable: false,
//     metadata: {
//       contentType: contentType,
//       metadata: {
//         pageUrl: url,
//       },
//     },
//   };
// }
