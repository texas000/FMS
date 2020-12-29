const sql = require("mssql");
const moment = require("moment");

const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: 'JWI_FMS',
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
            `SELECT TOP 10 * FROM T_FREIGHT_ADD WHERE F_REF='${req.headers.reference}' ;`
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
export const config = {
  api: {
    externalResolver: true,
  },
};
