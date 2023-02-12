const { Requester, Validator } = require("@chainlink/external-adapter");
require("dotenv").config();

const utils = require("./utils.js");

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === "Error") return true;
  return false;
};

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  matchIds: ["matchIds"],
  endpoint: false,
};

/**
 *
 * @param {any} input
 * @param {(status:number, result:any)=>{}} callback
 */
const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data);
  const validator = new Validator(input, customParams);

  const jobRunID = validator.validated.id;
  const endpoint = validator.validated.data.endpoint || ""; // Note: - no endpoint param in this example. Endpoint means  REST resource.

  const matchIds = validator.validated.data.matchIds;

  const url = `https://v3.football.api-sports.io/fixtures`;

  const queryParams = {
    ids: matchIds,
  };

  const headers = {
    "x-rapidapi-host": "v3.football.api-sports.io",
    "x-rapidapi-key": process.env.FOOTBALL_API,
  };

  const config = {
    url,
    params: queryParams,
    headers,
  };

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then((response) => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      let responseData = utils.getData(response.data);

      response.data = {
        result: responseData,
        date: response.headers.date,
      };

      callback(response.status, Requester.success(jobRunID, response));
    })
    .catch((error) => {
      console.log(error);

      callback(500, Requester.errored(jobRunID, error));
    });
};

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest;
