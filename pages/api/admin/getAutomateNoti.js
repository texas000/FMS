const sql = require("mssql");
const jwt = require("jsonwebtoken");

const sqlConfig = {
  server: "jameswi.com",
  port: 1533,
  database: "RYANDB",
  user: "jamesworldwide",
  password: process.env.JWDB_PASS,
  options: {
    encrypt: false,
    enableArithAbort: false,
  },
};

export default async (req, res) => {
  var db = new sql.ConnectionPool(sqlConfig);

  db.connect().then(() => {
    var request = new sql.Request(db);
    request
      .query(`SELECT * FROM T_EMAIL_NOTIFICATION WHERE F_CATEGORY='HR'`)
      .then((rec) => {
        sql.close();
        if (rec.rowsAffected[0]) {
          res.status(200).send(rec.recordset);
        } else {
          res.status(200).send(rec.recordset);
        }
      })
      .catch((err) => {
        sql.close();
        var errmsg = {
          code: err.code,
          msg: err.originalError.message || "error",
        };
        res.status(400).send(errmsg);
      });
  });
  // .then(() => {
  //   console.log("success");
  // });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
