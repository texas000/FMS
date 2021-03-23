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
  if (req.headers.company == "undefined") {
    res.status(201).send([]);
    return;
  } else {
    var Squery = `select * from V_JWI_ACCT where CompanyName = '${req.headers.company}' AND F_InvoiceAmt!=F_PaidAmt order by F_DueDate desc;`;
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
        console.log("ERROR FROM getOimmain");
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
