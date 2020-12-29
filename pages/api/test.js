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
        // const QRY = `INSERT INTO T_FREIGHT_ADD (F_HBL, F_OF) VALUES ('안녕', '라이언');`
        // const QRY = `SELECT * FROM T_FREIGHT_ADD;`
        console.log(req.body)
      
        let result = await pool
        .request()
        .query(req.body);
        console.log(result)
        if (result.rowsAffected.length) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json', 'charset=utf-8')
          res.end(
            JSON.stringify({status: true})
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
    resolve()
  });
};