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
    res.status(201).send([]);
    return;
  } else {
    var query = decodeURIComponent(req.headers.query);
    var Squery = `select F_ID, F_SName, F_Addr, F_City, F_Country from T_COMPANY where F_SName like '%${query}%' order by F_ID desc;`;
    const searchResult = await sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool.request().query(Squery);
      })
      .then((result) => {
        sql.close();
        if (result.rowsAffected[0]) {
          return result.recordsets[0];
        } else {
          return [];
        }
      })
      .catch((err) => {
        sql.close();
        console.log("ERROR FROM getCustomer");
        console.log(err);
        res.status(400).send(err);
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
