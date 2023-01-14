import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

/* ==== Start Utility Functions ==== */

// Create frame for Lametric Push API
const createFrame = (rawPrice, icon, index, duration = 1000) => {
  return {
    text: "$" + Number.parseFloat(rawPrice).toFixed(2),
    icon,
    index,
    duration
  };
};

/* ==== End Utility Functions ==== */

const init = async () => {
  let gasAPI, gasAPIResponse, lmBody;

  console.log('Retreving Gas Prices from API..')
  // Ping the upstream GAS API for prices
  gasAPI = await fetch(process.env.GAS_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json, text/javascript",
      "accept-language": "en-US",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: process.env.GAS_API_PARAMS,
  });
  gasAPIResponse = await gasAPI.json();

  // Check if API response is valid
  if (!gasAPIResponse.success) {
    //exit
    console.error("Invalid Gas Response Found");
    process.exit(1);
  }

  // Setup Body Frames for API
  lmBody = {
    frames: [
      {
        text: `Gas Price Averages - ${new Date().toLocaleDateString()} (USA)`,
        icon: "51740",
        index: 0,
        duration: 1000,
      },
      createFrame(gasAPIResponse.data.unleaded[0], 11711, 1, 5000),
      createFrame(gasAPIResponse.data.midgrade[0], 11713, 2, 5000),
      createFrame(gasAPIResponse.data.premium[0], 11714, 3, 5000),
      createFrame(gasAPIResponse.data.diesel[0], 11221, 4, 5000),
    ],
  };

  // Send to LaMetric Push API
  console.log('Pushing to LaMetric..')
  await fetch(process.env.LAMETRIC_DATA_URL, {
    method: "POST",
    headers: {
      "cache-control": "no-cache",
      "X-Access-Token": process.env.LAMETRIC_TOKEN,
      "accept": "application/json",
    },
    body: JSON.stringify(lmBody),
  });

  console.log("Done!");
  process.exit(0);
};

init();
