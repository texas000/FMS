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
        const QRY = `INSERT INTO T_BOARD (TITLE, BODY, TIME, SHOW) VALUES (${req.body});`
        let result = await pool
          .request()
          .query(QRY);
        if (result.rowsAffected[0]) {
            res.status(200).end(JSON.stringify(result.recordsets[0]));
        } else {
            res.status(400).end(false);
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
