const sql = require("mssql");
const moment = require("moment");

const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_2,
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
        let result = await pool
          .request()
          .query(
            `SELECT CAST(ARRIVED as INT) as ARRIVED FROM T_OIMDETAIL where REF='${req.headers.reference}';`
          );
        if (result.rowsAffected[0]) {
          // IF THERE IS DATA RETURN RESULT
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              ...result.recordsets[0][0],
              status: true
            })
          );
        } else {
          // IF THERE IS NO DATA RETURN FALSE STATUS
          res.end(JSON.stringify({ status: false }));
        }
      } catch (err) {
        return { err: err };
      } finally {
        pool.close();
        resolve()
      }
    }
    NEW()
    resolve()
  });
};
