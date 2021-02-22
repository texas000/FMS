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

  const MASTER = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID =T_AOMMAIN.F_Agent) as AGENT,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AOMMAIN.F_Carrier) as CARRIER,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AOMMAIN.F_FLocation) as CYLOC,
  * from T_AOMMAIN WHERE F_RefNo='${req.headers.reference}';`;

  const HOUSE = `SELECT (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AOHMAIN.F_Customer) as CUSTOMER,
        (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AOHMAIN.F_Consignee) as CONSIGNEE,
        (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AOHMAIN.F_Shipper) as SHIPPER,
        (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_AOHMAIN.F_Notify) as NOTIFY,
        * FROM T_AOHMAIN WHERE F_AOMBLID=`;

  var output = {};

  // GET MASTER FROM MSSQL - DATA TYPE OBJECT
  // GET MASTER FROM MSSQL - DATA TYPE OBJECT
  const master = await sql
    .connect(sqlConfig)
    .then((pool) => {
      return pool.request().query(MASTER);
    })
    .then((result) => {
      // MASTER
      if (result.rowsAffected[0]) {
        return result.recordsets[0][0];
      } else {
        res.status(400).send([]);
        return false;
      }
    })
    .catch((err) => {
      console.log("ERROR FROM MASTER");
      console.log(err);
      res.status(400).send(err);
      return sql.close();
    });
  // console.log(master);
  output = { ...output, M: master };

  if (master) {
    // GET HOUSE FROM MSSQL - DATA TYPE ARRAY
    // GET HOUSE FROM MSSQL - DATA TYPE ARRAY
    const house = await sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool.request().query(HOUSE + `'${master.F_ID}'`);
      })
      .then((result) => {
        if (result.rowsAffected[0]) {
          return result.recordsets[0];
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log("ERROR FROM HOUSE");
        console.log(err);
        res.status(400).send(err);
      });

    output = { ...output, H: house };

    if (house.length > 0) {
      var AP = house.map((ga, i) => {
        if (i) {
          return ` OR F_TBID='${ga.F_ID}' AND F_TBName='T_AOHMAIN'`;
        } else {
          return `F_TBID='${ga.F_ID}' AND F_TBName='T_AOHMAIN'`;
        }
      });
      AP = AP.join("");
      const ap = await sql
        .connect(sqlConfig)
        .then((pool) => {
          return pool
            .request()
            .query(
              `SELECT (SELECT T_COMPANY.F_SName FROM T_COMPANY WHERE T_COMPANY.F_ID=T_APHD.F_PayTo) AS PAY, * FROM T_APHD WHERE ${AP};`
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
    } else {
      output = { ...output, A: [] };
    }
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
