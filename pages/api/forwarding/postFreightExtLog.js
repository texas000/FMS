var request = require("request");
export default async (req, res) => {
  // Define Request Options, *** USE ENV VALUE FOR BASE URI ***
  var options = {
    method: "POST",
    url: `${process.env.FS_BASEPATH}freight_ext_log`,
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
    },
    body: JSON.parse(req.body),
    json: true,
  };

  request(options, function (error, response, body) {
    // IF ERROR, THROW ERROR
    if (error) throw new Error(error);
    // IF RESPONSE IS 200, SEND THE BODY WITH 200 STATUS CODE
    if (response.statusCode === 204 || response.statusCode === 200) {
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
