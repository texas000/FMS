var request = require("request");
var formidable = require("formidable");
var fs = require("fs");
const sql = require("mssql");
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
      url: `http://jameswi.com:49991/api/upload/${ref}`,
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

    request(options, async function (error, response, body) {
      if (error) throw new Error(error);

      // INSERT FILE DATA TO DB
      let pool = new sql.ConnectionPool(process.env.SERVER21);
      const qry = `INSERT INTO T_FILE VALUES ('${token.uid}', GETDATE(), '${req.headers.label}', '${ref}', '${req.headers.level}', N'${name}');`;
      try {
        await pool.connect();
        let result = await pool.request().query(qry);
        res.json(result);
      } catch (err) {
        res.json(err);
      }
      return pool.close();
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
