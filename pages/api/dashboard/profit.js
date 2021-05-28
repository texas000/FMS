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

  var Query = null;
  if (req.headers.id == "null" || req.headers.table == "null") {
    // 204 IS NO CONTENT
    res.status(204).send([]);
    return;
  }
  if (token) {
    Query = `select * from V_PROFIT_H where F_TBID='${
      req.headers.id || ""
    }' AND F_TBName='${req.headers.table || ""}';`;
  } else {
    res.status(201).send([]);
    return;
  }

  const result = await sql
    .connect(sqlConfig)
    .then(async (pool) => {
      return await pool.request().query(Query);
    })
    .then((result) => {
      if (result.rowsAffected[0]) {
        return result.recordsets[0];
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.log(`ERROR FROM PROFIT - QUERY: ${Query}`);
      console.log(err);
      sql.close();
      return [];
    });
  res.status(200).send(result);
  // return sql.close();
};
