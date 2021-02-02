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
  const token = jwt.decode(req.headers.key);
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  const Query = `select distinct T_AIMMAIN.F_ID as ID, T_AIMMAIN.F_FileClosed as CLOSED, T_AIMMAIN.F_RefNo as REF, T_AIMMAIN.F_ETA as ETA, T_AIMMAIN.F_ETD as ETD, 
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID=T_AIHMAIN.F_Customer) as CUSTOMER from T_AIMMAIN left join T_AIHMAIN on T_AIMMAIN.F_ID=T_AIHMAIN.F_AIMBLID where (T_AIMMAIN.F_U1ID='${
    token.fsid
  }' OR T_AIMMAIN.F_U2ID='${token.fsid}') 
  AND T_AIMMAIN.F_FileClosed=0 AND T_AIMMAIN.F_ETA>'${
    req.headers.from || "2021-01-01"
  }' order by T_AIMMAIN.F_ID desc;`;

  const result = await sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().query(Query);
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
      console.log("ERROR FROM MASTER");
      console.log(err);
      res.status(400).send(err);
      return sql.close();
    });
  res.status(200).send(result);
  return sql.close();
};
