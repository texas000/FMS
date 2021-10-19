const sql = require("mssql");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  var db = new sql.ConnectionPool(process.env.SERVER5);

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
};

export const config = {
  api: {
    externalResolver: true,
  },
};
