/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope Public
 */
const NETSUITE = {};
define(["N/runtime", "N/search"], function (runtime, search) {
  NETSUITE.runtime = runtime;
  NETSUITE.search = search;
  return { onRequest: onRequest };
});
function onRequest(context) {
  try {
    const request = context.request;
    const reply = function (json) {
      return context.response.write(JSON.stringify(json, null, 2));
    };
    if (request.method !== "POST") {
      throw new Error(
        'This API only supports POST requests, got "' + request.method + '"'
      );
    }
    const body = JSON.parse(request.body);
    if (!body.token) {
      throw new Error('Missing parameter "token"');
    }
    const token = NETSUITE.runtime
      .getCurrentScript()
      .getParameter({ name: "custscript_stackshine_api_token" });
    if (!token) {
      throw new Error("Bad Configuration: The custom script parameter 'custscript_stackshine_api_token' in the NetSuite script configuration is missing.");
    }
    if (token !== body.token) {
      throw new Error(
        'Authorization Error: Custom parameter "custscript_stackshine_api_token" provided to Stackshine does not match the one in NetSuite.'
      );
    }
    if (body.func === "raw") {
      if (!body.code) {
        throw new Error('Missing "code" in body');
      }
      return reply(eval(body.code));
    } else if (body.func === "search") {
      if (!body.options) {
        throw new Error('Missing "options" in body');
      }
      const search = NETSUITE.search.create(body.options);
      if (body.start || body.end) {
        const result = search
          .run()
          .getRange({ start: body.start, end: body.end });
        return reply(result);
      }
      const results = [];
      const pagedResults = NETSUITE.search.create(body.options).runPaged();
      pagedResults.pageRanges.forEach(function (pageRange) {
        var currentPage = pagedResults.fetch({ index: pageRange.index });
        currentPage.data.forEach(function (result) {
          results.push(result);
        });
        return !0;
      });
      return reply(results);
    } else {
      throw new Error('Unknown "func" in body - got "' + request.func + '"');
    }
  } catch (e) {
    reply({
      error: e.toString(),
      stack: (e.stack && e.stack.split && e.stack.split("\n")) || e.stack,
    });
  }
}