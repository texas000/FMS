const sql = require("mssql");
const jwt = require("jsonwebtoken");
const moment = require("moment");

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
  const token = jwt.decode(req.headers.key);
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  var Query = null;
  if (token.admin) {
    Query = `
    SELECT TOP 300 *, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Customer=T_COMPANY.F_ID) AS Customer, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Consignee=T_COMPANY.F_ID) AS Consignee, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Shipper=T_COMPANY.F_ID) AS Shipper, ROW_NUMBER() OVER (PARTITION BY T_AIMMAIN.F_RefNo ORDER BY T_AIMMAIN.F_ID) AS HouseCount from T_AIMMAIN LEFT JOIN T_AIHMAIN on (T_AIHMAIN.F_AIMBLID=T_AIMMAIN.F_ID) where T_AIMMAIN.F_FileClosed='0' ORDER BY T_AIMMAIN.F_ID DESC;
    `;
  }

  if (req.headers.search) {
    Query = `SELECT TOP 100 *, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Customer=T_COMPANY.F_ID) AS Customer, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Consignee=T_COMPANY.F_ID) AS Consignee, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Shipper=T_COMPANY.F_ID) AS Shipper, ROW_NUMBER() OVER (PARTITION BY T_AIMMAIN.F_RefNo ORDER BY T_AIMMAIN.F_ID) AS HouseCount from T_AIMMAIN LEFT JOIN T_AIHMAIN on (T_AIHMAIN.F_AIMBLID=T_AIMMAIN.F_ID) where T_AIMMAIN.F_RefNo LIKE '%${req.headers.search}%' ORDER BY T_AIMMAIN.F_ID DESC;`;
  }
  const result = await sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().query(Query);
    })
    .then((result) => {
      if (result.rowsAffected[0]) {
        return result.recordsets[0];
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.log("ERROR FROM AIM");
      console.log(err);
      res.status(400).send([]);
    });
  res.status(200).send(result);
  return sql.close();
};
