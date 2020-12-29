import sql from "mssql";

const FSConfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_1,
  user: process.env.JWDB_USER,
  password: process.env.JWDB_PASS,
  options: {
    appName: "test",
    encrypt: false,
    enableArithAbort: false,
  },
};

export default (req, res) => {
  return new Promise((resolve) => {
    try {
      sql.connect(FSConfig, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(
          `SELECT TOP 100 * FROM T_INVENHD ORDER BY F_ID DESC`,
          function (err, data) {
            if (err) console.log(err);
            res.status(200).end(JSON.stringify(data.recordset));
            
          }
        );
      });
      return resolve();
    } catch (err) {
      console.log(err)
      res.status(500).end()
      return resolve()
    }
    res.status(405).end()
    return resolve()
  });
};
