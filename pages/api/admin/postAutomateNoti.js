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
  var qry = `INSERT INTO T_EMAIL_NOTIFICATION (F_MAILTO, F_SUBJECT, F_CONTENT, F_TARGET, F_RECURR, F_SENT, F_PERIOD_INT, F_PERIOD_STR, F_CATEGORY) VALUES(${req.body})`;
  db.connect().then(() => {
    var request = new sql.Request(db);
    request
      .query(qry)
      .then((rec) => {
        sql.close();
        if (rec.rowsAffected[0]) {
          res.status(200).send(rec.recordsets);
        } else {
          res.status(401).send(false);
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
