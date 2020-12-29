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
          .query(req.body);
        // console.log(result)
        if (result.rowsAffected[result.rowsAffected.length-1]) {
            res.status(200).json(result.recordset);
        } else {
            res.status(400).send(['EMPTY']);
        }
      } catch (err) {
        console.log(err)
        res.status(401).json({error: err.name, number: err.number, line: err.lineNumber})
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

