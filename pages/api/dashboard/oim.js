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
  // console.log(token);
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  var Query = null;
  switch (token.admin) {
    case 9:
      Query = `
      SELECT TOP 100 *, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Customer=T_COMPANY.F_ID) AS Customer, ROW_NUMBER() OVER (PARTITION BY T_OIMMAIN.F_RefNo ORDER BY T_OIMMAIN.F_ID) AS HouseCount from T_OIMMAIN LEFT JOIN T_OIHMAIN on (T_OIHMAIN.F_OIMBLID=T_OIMMAIN.F_ID) where F_ETA>'${moment()
        .subtract(30, "days")
        .calendar()}' ORDER BY T_OIMMAIN.F_ID DESC;
      `;
      break;
    default:
      Query = `
      SELECT TOP 100 *, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Customer=T_COMPANY.F_ID) AS Customer, ROW_NUMBER() OVER (PARTITION BY T_OIMMAIN.F_RefNo ORDER BY T_OIMMAIN.F_ID) AS HouseCount from T_OIMMAIN LEFT JOIN T_OIHMAIN on (T_OIHMAIN.F_OIMBLID=T_OIMMAIN.F_ID) where F_ETA>'${moment()
        .subtract(30, "days")
        .calendar()}' AND (T_OIMMAIN.F_U1ID='${
        token.fsid
      }' OR T_OIMMAIN.F_U2ID='${token.fsid}') ORDER BY T_OIMMAIN.F_ID DESC;
      `;
      break;
  }

  //   SELECT DISTINCT
  // 	T_OIMMAIN.F_ID AS ID,
  // 	T_OIMMAIN.F_RefNo AS RefNo,
  // 	T_OIMMAIN.F_ETA AS ETA,
  // 	T_OIMMAIN.F_ETD AS ETD,
  // 	T_OIMMAIN.F_LoadingPort AS LP,
  // 	T_OIMMAIN.F_DisCharge AS DC,
  // 	T_OIMMAIN.F_FinalDest AS DT,
  // 	T_OIMMAIN.F_Agent AS AgentId,
  // 	T_OIHMAIN.F_Customer AS CustomerId,
  // 	(
  // 		SELECT
  // 			T_COMPANY.F_SName
  // 		FROM
  // 			T_COMPANY
  // 		WHERE
  // 			T_COMPANY.F_ID = T_OIHMAIN.F_Customer) AS Customer
  // 	FROM
  // 		T_OIMMAIN
  // 	LEFT JOIN T_OIHMAIN ON T_OIMMAIN.F_ID = T_OIHMAIN.F_OIMBLID
  // WHERE (T_OIMMAIN.F_U1ID = '${token.fsid}'
  // 	OR T_OIMMAIN.F_U2ID = '${token.fsid}')
  // AND T_OIMMAIN.F_ETA > '${moment().subtract(30, "days").calendar()}'
  // ORDER BY
  // 	T_OIMMAIN.F_ID DESC;

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
      console.log("ERROR FROM OIM");
      console.log(err);
      res.status(400).send([]);
    });
  res.status(200).send(result);
  return sql.close();
};
