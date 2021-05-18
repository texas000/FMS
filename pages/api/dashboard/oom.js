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
  switch (token.admin) {
    case 9:
      Query = `
      SELECT TOP 100 *, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Customer=T_COMPANY.F_ID) AS Customer, ROW_NUMBER() OVER (PARTITION BY T_OOMMAIN.F_RefNo ORDER BY T_OOMMAIN.F_ID) AS HouseCount from T_OOMMAIN LEFT JOIN T_OOHMAIN on (T_OOHMAIN.F_OOMBLID=T_OOMMAIN.F_ID) where F_ETA>'${moment()
        .subtract(30, "days")
        .calendar()}' ORDER BY T_OOHMAIN.F_ID DESC;
      `;
      break;
    default:
      Query = `
      SELECT TOP 100 *, (SELECT T_COMPANY.F_SName from T_COMPANY where F_Customer=T_COMPANY.F_ID) AS Customer, ROW_NUMBER() OVER (PARTITION BY T_OOMMAIN.F_RefNo ORDER BY T_OOMMAIN.F_ID) AS HouseCount from T_OOMMAIN LEFT JOIN T_OOHMAIN on (T_OOHMAIN.F_OOMBLID=T_OOMMAIN.F_ID) where F_ETA>'${moment()
        .subtract(30, "days")
        .calendar()}' AND (T_OOMMAIN.F_U1ID='${
        token.fsid
      }' OR T_OOMMAIN.F_U2ID='${token.fsid}') ORDER BY T_OOMMAIN.F_ID DESC;
      `;
      break;
  }

  //   SELECT DISTINCT
  //       T_OOHMAIN.F_ID AS ID,
  // 	T_OOMMAIN.F_RefNo AS RefNo,
  // 	T_OOMMAIN.F_ETA AS ETA,
  // 	T_OOMMAIN.F_ETD AS ETD,
  // 	T_OOMMAIN.F_LoadingPort AS LP,
  // 	T_OOMMAIN.F_DisCharge AS DC,
  // 	T_OOMMAIN.F_Agent AS AgentId,
  // 	T_OOHMAIN.F_Customer AS CustomerId,
  // 	(
  // 		select DISTINCT T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID=T_OOHMAIN.F_Customer) AS Customer
  // 	FROM
  // 		T_OOMMAIN
  // 	LEFT JOIN T_OOHMAIN ON T_OOMMAIN.F_ID = T_OOHMAIN.F_OOMBLID
  // WHERE (T_OOMMAIN.F_U1ID = '${token.fsid}'
  // 	OR T_OOMMAIN.F_U2ID = '${token.fsid}')
  // AND T_OOMMAIN.F_ETA > '${moment().subtract(30, "days").calendar()}'
  // ORDER BY
  // T_OOHMAIN.F_ID DESC;

  // const Query = `select distinct T_OOMMAIN.F_ID as ID, T_OOMMAIN.F_FileClosed as CLOSED, T_OOMMAIN.F_RefNo as REF, T_OOMMAIN.F_ETA as ETA, T_OOMMAIN.F_ETD as ETD,
  // (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID=T_OOHMAIN.F_Customer) as CUSTOMER from T_OOMMAIN left join T_OOHMAIN on T_OOMMAIN.F_ID=T_OOHMAIN.F_OOMBLID where (T_OOMMAIN.F_U1ID='${
  //   token.fsid
  // }' OR T_OOMMAIN.F_U2ID='${token.fsid}')
  // AND T_OOMMAIN.F_FileClosed=0 AND T_OOMMAIN.F_ETD>'${
  //   req.headers.from || "2021-01-01"
  // }' order by T_OOMMAIN.F_ID desc;`;

  const result = await sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().query(Query);
    })
    .then((result) => {
      // MASTER
      sql.close();
      if (result.rowsAffected[0]) {
        return result.recordsets[0];
      } else {
        return [];
      }
    })
    .catch((err) => {
      sql.close();
      console.log("ERROR FROM OOM");
      console.log(err);
      res.status(400).send([]);
    });
  res.status(200).send(result);
  return sql.close();
};
