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
            `SELECT TOP 100 * FROM T_TRUCK_COMPANY WHERE F_PORT like '%${req.headers.query}%';`
          );
        if (result.rowsAffected[0]) {
          // IF THERE IS DATA RETURN RESULT
          res.status(200).end(JSON.stringify(result.recordsets[0]));
        } else {
          // IF THERE IS NO DATA RETURN FALSE STATUS
          res.status(400).end(false);
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