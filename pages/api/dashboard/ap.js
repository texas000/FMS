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
      Query = `select T_APHD.*, T_COMPANY.F_Addr, T_COMPANY.F_City, T_COMPANY.F_State, T_COMPANY.F_ZipCode, T_COMPANY.F_SName, T_COMPANY.F_IRSNo, T_COMPANY.F_IRSType from T_APHD INNER JOIN T_COMPANY ON F_PayTo=T_COMPANY.F_ID where F_TBID='${req.headers.id}' AND F_TBName='${req.headers.table}';`;
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
        console.log(`ERROR FROM AP - QUERY: ${Query}`);
        console.log(err);
        return [];
      });
    res.status(200).send(result);
    return sql.close();
  }
};
