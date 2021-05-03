var request = require("request");
var os = require("os");

export default async (req, res) => {
  var texts = {
    text: `${req.body.text}`,
  };
  // Define Request Options, *** USE ENV VALUE FOR BASE URI ***
  var options = {
    method: "POST",
    uri: process.env.SLACK_IT,
    headers: {
      "content-type": "application/json",
    },
    body: texts,
    json: true,
  };

  request(options, function (error, response, body) {
    // IF ERROR, THROW ERROR
    if (error) throw new Error(error);
    // IF RESPONSE IS 200, SEND THE BODY WITH 200 STATUS CODE
    if (response.statusCode === 200) {
      res.status(200).send(body);
    } else {
      // Otherwise, send the whole response to see the result from front end
      res.status(response.statusCode).send(JSON.stringify(response));
    }
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
