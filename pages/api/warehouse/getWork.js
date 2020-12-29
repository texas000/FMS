const sql = require("mssql");
const moment = require('moment');

const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_3,
  user: process.env.JWDB_USER,
  password: process.env.JWDB_PASS,
  options: {
    appName: "test",
    encrypt: false,
    enableArithAbort: false,
    database: process.env.JWDB_2,
  },
};

export default async (req, res) => {
  return new Promise((resolve) => {
    async function NEW() {
      const pool = new sql.ConnectionPool(SQLconfig);
      pool.on("error", (err) => {
        console.log("sql error", err);
      });
      try {
        await pool.connect();
        var QRY;
        if(req.headers.time) {
          QRY = `SELECT TOP 100 * FROM V_JWI_STAFFING WHERE WORK_DATE='${req.headers.time}';`
        } else {
          QRY = `SELECT TOP 100 * FROM V_JWI_STAFFING WHERE WORK_DATE='${moment().format('YYYY-MM-DD')}';`
        }

        let result = await pool.request().query(QRY);
        if (result.rowsAffected[0]) {
          res.status(200).end(JSON.stringify(result.recordsets[0]));
        } else {
          res.status(200).end(JSON.stringify(false));
        }
      } catch (err) {
        res.status(400).end(JSON.stringify(err));
      } finally {
        pool.close();
      }
    }
    NEW()
    resolve()
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
