const sql = require("mssql");
const jwt = require("jsonwebtoken");
const sqlConfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_1,
  user: process.env.JWDB_USER,
  password: process.env.JWDB_PASS,
  options: {
    appName: "FMS",
    encrypt: false,
    enableArithAbort: false,
  },
};

export default async (req, res) => {
  //Get Access token from the client side and filter the access
  const token = req.headers.key;
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (req.headers.id == "null" || req.headers.table == "null") {
    res.status(201).send([]);
  } else {
    var Query = null;
    if (token) {
      Query = `select * from T_INVOHD where F_TBID='${req.headers.id}' and F_TBName='${req.headers.table}';`;
    }

    const result = await sql
      .connect(sqlConfig)
      .then(async (pool) => {
        return await pool.request().query(Query);
      })
      .then((result) => {
        // MASTER
        if (result.rowsAffected[0]) {
          return result.recordsets[0];
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log(`ERROR FROM INVOICE - QUERY: ${Query}`);
        console.log(err);
        // res.status(400).send([]);
        return [];
      });
    res.status(200).send(result);
    return sql.close();
  }
};
