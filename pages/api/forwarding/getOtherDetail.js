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
  const MASTER = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_GENMAIN.F_Customer) as CUSTOMER, T_GENMAIN.*, T_AOTHERINFO.F_C1, T_AOTHERINFO.F_C2, T_AOTHERINFO.F_C3, T_AOTHERINFO.F_C4 from T_GENMAIN join T_AOTHERINFO on T_GENMAIN.F_ID = T_AOTHERINFO.F_TBID and T_AOTHERINFO.F_TBNAME='T_GENMAIN' WHERE F_RefNo='${req.headers.reference}';`;

  var output = {};

  // GET MASTER FROM MSSQL - DATA TYPE OBJECT
  // GET MASTER FROM MSSQL - DATA TYPE OBJECT
  const master = await sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().query(MASTER);
    })
    .then((result) => {
      // console.log(result);
      sql.close();
      if (result.rowsAffected[0]) {
        return result.recordsets[0][0];
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.log("ERROR FROM MASTER");
      console.log(err);
      res.status(400).send(err);
      return false;
    });
  //   console.log(master);
  output = { ...output, M: master };

  if (master) {
    const ap = await sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .query(
            `SELECT (SELECT T_COMPANY.F_SName FROM T_COMPANY WHERE T_COMPANY.F_ID=T_APHD.F_PayTo) AS PAY, * FROM T_APHD WHERE F_TBID='${master.F_ID}' AND F_TBName='T_GENMAIN';`
          );
      })
      .then((result) => {
        // console.log(result.rowsAffected);
        if (result.rowsAffected[0]) {
          return result.recordsets[0];
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log("ERROR FROM AP");
        console.log(err);
        res.status(400).send(err);
      });
    output = { ...output, A: ap };

    // console.log(output);
    // SUCCESS, SEND THE OUTPUT
    res.status(200).send(output);
  } else {
    res.status(200).send({ ...output, status: false });
  }
  return sql.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
