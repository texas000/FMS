var request = require("request");
var formidable = require("formidable");
var fs = require("fs");

export default async (req, res) => {
  const promise = new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
      }
      resolve({ fields, files });
    });
  });
  return promise.then(({ fields, files }) => {
    var file = fs.readFileSync(files.userPhoto.path);
    var name = files.userPhoto.name;
    var options = {
      method: "POST",
      url: `http://jameswgroup.com:49991/api/upload/${req.headers.reference}`,
      headers: {
        "cache-control": "no-cache",
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
      formData: {
        userPhoto: {
          value: file,
          options: { filename: name, contentType: null },
        },
      },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(response);
      res.status(200).json(true);
    });
  });
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};
