import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

/* ==== Start Utility Functions ==== */

// Create frames for Lametric Push API
const createDateBody = () => {
  return {
      frames: [
        {
          text: new Date().toLocaleDateString(),
          icon: 51740
        }
      ]
  }
}
const createChannelBody = (rawPrices, icon) => {

  let diffYesterday = Number.parseFloat(rawPrices[1]-rawPrices[2]).toFixed(2);
  diffYesterday = diffYesterday == 0 ? '$-.--' : "$" + diffYesterday
  let diffIcon = diffYesterday == '$-.--'? 401 : (diffYesterday > 0 ? 37021 : 37019) ;
  console.log(diffYesterday, diffIcon, Number.parseFloat(rawPrices[0]).toFixed(2))
  return {
    frames: [
      {
        text: "$" + Number.parseFloat(rawPrices[0]).toFixed(2),
        icon
      },
      {

        text: diffYesterday,
        icon: diffIcon
      }
    ]
  };
};
const pushToChannel = async (channel, body) => {
console.log(JSON.stringify(body))
console.log(channel)
  console.log(`${process.env.LAMETRIC_DATA_URL}?channels=${channel}`)
  const response = await fetch(`${process.env.LAMETRIC_DATA_URL}?channels=${channel}`, {
    method: "POST",
    headers: {
      "cache-control": "no-cache",
      "X-Access-Token": process.env.LAMETRIC_TOKEN,
      "accept": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log('response', response)

  return true;
}

/* ==== End Utility Functions ==== */

const init = async () => {
  let gasAPI, gasAPIResponse;

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

  // Send to LaMetric Push API
  console.log('Pushing to LaMetric..')
  await pushToChannel('Date', createDateBody())
  await pushToChannel('Unleaded', createChannelBody(gasAPIResponse.data.unleaded, 11711))
  await pushToChannel('Midgrade', createChannelBody(gasAPIResponse.data.midgrade, 11713))
  await pushToChannel('Premium', createChannelBody(gasAPIResponse.data.premium, 11714))
  await pushToChannel('Diesel', createChannelBody(gasAPIResponse.data.diesel, 11221))
  console.log("Done!");
  //process.exit(0);
};

init();
