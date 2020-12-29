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
          `SELECT
            COUNT(F_ID) AS COUNT, DATEPART(week,F_ETA) AS WEEKS
        FROM
            T_OIMMAIN
        WHERE
            F_ETA >= '2020-01-01'
        GROUP BY
            DATEPART (week,F_ETA)
        ORDER BY
            DATEPART (week,F_ETA)
        ;`,
          function (err, data) {
            if (err) console.log(err);
            res.status(200).end(JSON.stringify(data.recordset));
          }
        );
      });
      resolve();
    } catch (err) {
      console.log(err);
      res.status(500).end();
      resolve();
    }
  });
};
