var request = require("request");
var formidable = require("formidable");
var fs = require("fs");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const rawCookie = req.headers.cookie || "";
  const cookies = cookie.parse(rawCookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);

  const { ref } = req.query;
  if (!ref) {
    res.status(400).send("BAD REQUEST");
    return;
  }
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
      url: `http://jameswi.com:49991/api/file/upload/${ref}`,
      headers: {
        "cache-control": "no-cache",
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        upload_by: token.uid,
        label: "default",
        security: "40",
      },
      formData: {
        userPhoto: {
          value: file,
          options: { filename: name, contentType: null },
        },
      },
    };

    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      return res.status(200).send(JSON.parse(response.body));
      // INSERT FILE DATA TO DB
      // res.status(200).json(true);
    });
  });
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};
