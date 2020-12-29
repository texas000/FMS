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
                (
                    SELECT
                        COUNT(*)
                    FROM
                        T_OIMMAIN
                    WHERE
                        F_ETA >= '2020-01-01') AS OIM, (
                        SELECT
                            COUNT(*) AS TOTAL
                        FROM
                            T_OOMMAIN
                        WHERE
                            F_ETA >= '2020-01-01') AS OOM, (
                        SELECT
                            COUNT(*) AS TOTAL
                        FROM
                            T_AIMMAIN
                        WHERE
                            F_ETA >= '2020-01-01') AS AIM,
                        (
                        SELECT
                            COUNT(*) AS TOTAL
                        FROM
                            T_AOMMAIN
                        WHERE
                            F_ETA >= '2020-01-01') AS AOM
            `,
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
export const config = {
  api: {
    externalResolver: true,
  },
};
