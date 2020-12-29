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

        const QRY = `INSERT INTO T_STAFFING_WORKLOG (S_ID, W_DATE, W_START, W_END, W_LUNCH_START, W_LUNCH_END) VALUES ${req.body};`;
        console.log(QRY)

        let result = await pool.request().query(QRY);
        if (result.rowsAffected[0]) {
          // console.log(result)
          //IF DATA IS SUCCESSFULLY SAVED, RESPOND WITH TURE
          res.status(200).end(JSON.stringify(true));
        } else {
          res.status(403).end(JSON.stringify(false));
        }
      } catch (err) {
        //IF DATA IS NOT STORED AT DB, RESPOND WITH ERROR
        res.status(400).end(JSON.stringify(err))
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
