const sql = require("mssql");

const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_1,
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
        // THROW ERROR IF THERE IS NO USER
        if (req.headers.name === undefined) throw new Error("PLEASE LOG IN");
        // IF THERE IS NO QUERY, RETURN EMPTY ARRAY
        if(req.headers.query=="false") res.status(200).end([]);

        var Squery = `SELECT TOP 100 * FROM V_JWI_SEARCH WHERE MASTER_ID<>''`;
        const options = req.headers.options || false;
        var option;
        if (options) {
          option = options.split(",");
          option.map((data, i) => {
            if (i) {
              Squery += ` OR ${data} LIKE '%${req.headers.query}%'`;
            } else {
              Squery += ` AND ${data} LIKE '%${req.headers.query}%'`;
            }
          });
        }
        Squery += " ORDER BY ETD DESC;";
        await pool.connect();
        let result = await pool.request().query(Squery);
        if (result.rowsAffected[0]) {
          // IF DATA EXISTS RETURN TRUE RESULT
          const results = result.recordsets[0];
          res.status(200).end(JSON.stringify(results));
          resolve();
        } else {
          // IF DATA IS NOT EXIST RETURN FALSE RESULT          
          res.status(400).send([]);
        }
      } catch (err) {
        res.status(501).send({message: `Error Occured ${JSON.stringify(err)}`})
      } finally {
        pool.close();
        resolve();
      }
    }
    NEW();
    resolve();
  });
};
export const config = {
  api: {
    externalResolver: true,
  },
};
