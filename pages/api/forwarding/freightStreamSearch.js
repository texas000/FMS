const sql = require("mssql");
const jwt = require("jsonwebtoken");

const sqlConfig = {
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
  const token = jwt.decode(req.headers.key);
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (req.headers.query == "undefined") {
    console.log("query is undefined");
    res.status(201).send([]);
    return;
  } else {
    var Squery = `SELECT TOP 100 * FROM V_JWI_SEARCH WHERE MASTER_ID<>'' 
    AND (CUSTOMER LIKE '%${req.headers.query}%' OR MASTER_BLNO LIKE '%${req.headers.query}%'
    OR CONSIGNEE LIKE '%${req.headers.query}%' OR HOUSE_BLNO LIKE '%${req.headers.query}%' OR RefNO LIKE '%${req.headers.query}%') ORDER BY ETD DESC;`;

    const searchResult = await sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool.request().query(Squery);
      })
      .then((result) => {
        // MASTER
        if (result.rowsAffected[0]) {
          return result.recordsets[0];
        } else {
          res.status(400).send([]);
          return false;
        }
      })
      .catch((err) => {
        console.log("ERROR FROM SEARCH");
        console.log(err);
        res.status(400).send(err);
        return sql.close();
      });

    // SUCCESS, SEND THE OUTPUT
    res.status(200).send(searchResult);
    return sql.close();
  }
};
export const config = {
  api: {
    externalResolver: true,
  },
};
