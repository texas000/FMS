var request = require("request");
export default async (req, res) => {
  var options = {
    method: "GET",
    url: `${process.env.FS_BASEPATH}oimmain_ext?RefNo=${req.headers.ref}`,
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
    },
    json: true,
  };
  // ?RefNo=${req.headers.ref}

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    // console.log(Object.getPrototypeOf(req.body));

    if (response.statusCode === 200) {
      res.send(body);
    } else {
      res.send(JSON.stringify(response));
    }
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
