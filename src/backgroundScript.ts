import config from "./config";
import log from "./log";
import { CphSubmitResponse, CphEmptyResponse } from "./types";
import { handleSubmit } from "./handleSubmit";
import { keepAlive } from "./keepAlive";
// main background
const mainLoop = async () => {
  let cphResponse;
  try {
    const headers = new Headers();
    headers.append("cph-submit", "true");

    const request = new Request(config.cphServerEndpoint.href, {
      method: "GET",
      headers,
    });

    cphResponse = await fetch(request);
  } catch (err) {
    log("Error while fetching cph response", err);
    return;
  }

  if (!cphResponse.ok) {
    log("Error while fetching cph response", cphResponse);
    return;
  }

  const response = await cphResponse.json();

  if (response.empty) {
    log("Got empty valid response from CPH");

    return;
  }

  log("Got non-empty valid response from CPH");
  log(response);
  handleSubmit(response.problemName, response.languageId, response.sourceCode, response.url);
};

setInterval(mainLoop, config.loopTimeOut);


keepAlive();
