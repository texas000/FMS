const sql = require("mssql");
const moment = require("moment");

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
        let result = await pool
          .request()
          .query(
            `SELECT * FROM T_MEMBER;`
          );
        if (result.rowsAffected[0]) {
          res.statusCode = 200;
          res.end(
            JSON.stringify(result.recordsets[0])
          );
        } else {
          res.statusCode = 401;
          res.end(JSON.stringify({ status: false }));
        }
        // return { success: result };
      } catch (err) {
        return { err: err };
      } finally {
        pool.close();
      }
    }
    NEW()
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
