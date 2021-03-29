var request = require("request");
export default async (req, res) => {
  // Define Request Options, *** USE ENV VALUE FOR BASE URI ***
  var options = {
    method: "POST",
    url: `${process.env.FS_BASEPATH}truck_company`,
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json; charset=utf-8",
      "x-api-key": process.env.JWT_KEY,
    },
    body: JSON.parse(req.body),
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
