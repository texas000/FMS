const sql = require("mssql");

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
        const QRY = `UPDATE T_MEMBER SET ${req.body};`
        let result = await pool
          .request()
          .query(QRY);
        console.log(result.rowsAffected)
        if (result.rowsAffected[0]) {
          res.statusCode = 200;
          res.end(JSON.stringify(true));
        } else {
          res.statusCode = 401;
          res.end(JSON.stringify(false));
        }
      } catch (err) {
        return { err: err };
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
