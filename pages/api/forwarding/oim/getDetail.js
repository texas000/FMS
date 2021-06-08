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
  if (!token.admin) {
    res.status(401).send("Unauthorized");
    return;
  }

  const MASTER = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID =T_OIMMAIN.F_Agent) as AGENT,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OIMMAIN.F_Carrier) as CARRIER,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OIMMAIN.F_CYLocation) as CYLOC,
  * from T_OIMMAIN WHERE F_RefNo='${req.headers.reference}';`;

  const HOUSE = `SELECT (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OIHMAIN.F_Customer) as CUSTOMER,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OIHMAIN.F_Consignee) as CONSIGNEE,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OIHMAIN.F_Notify) as NOTIFY,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OIHMAIN.F_Broker) as BROKER,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OIHMAIN.F_Shipper) as SHIPPER, * FROM 
  T_OIHMAIN WHERE F_OIMBLID=`;

  const CONTAINER = `SELECT T_OIMCONTAINER.*, T_OIHCONTAINER.F_OIHBLID as F_OIHBLID from T_OIMCONTAINER
   LEFT JOIN T_OIHCONTAINER on T_OIMCONTAINER.F_ID = T_OIHCONTAINER.F_OIMCntID where F_OIMBLID=`;

  var output = { M: [], H: [], C: [], A: [], P: [], I: [], CR: [] };

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
        return false;
      }
    })
    .catch((err) => {
      console.log(`ERROR FROM MASTER ${err}`);
      return false;
    });

  output = { ...output, M: master };

  if (master) {
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
        console.log(`ERROR FROM HOUSE ${err}`);
        return [];
      });

    output = { ...output, H: house };

    const container = await sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool.request().query(CONTAINER + `'${master.F_ID}'`);
      })
      .then((result) => {
        if (result.rowsAffected[0]) {
          return result.recordsets[0];
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log(`ERROR FROM CONTAINER ${err}`);
        return [];
      });

    output = { ...output, C: container };

    if (house.length > 0) {
      var HouseQuery = house.map((ga, i) => {
        if (i) {
          return ` OR F_TBID='${ga.F_ID}' AND F_TBName='T_OIHMAIN'`;
        } else {
          return `F_TBID='${ga.F_ID}' AND F_TBName='T_OIHMAIN'`;
        }
      });
      HouseQuery = HouseQuery.join("");
      const ap = await sql
        .connect(sqlConfig)
        .then((pool) => {
          return pool
            .request()
            .query(
              `select T_APHD.*, T_COMPANY.F_Addr, T_COMPANY.F_City, T_COMPANY.F_State, T_COMPANY.F_ZipCode, T_COMPANY.F_SName, T_COMPANY.F_IRSNo, T_COMPANY.F_IRSType from T_APHD INNER JOIN T_COMPANY ON F_PayTo=T_COMPANY.F_ID WHERE ${HouseQuery};`
            );
        })
        .then((result) => {
          if (result.rowsAffected[0]) {
            return result.recordsets[0];
          } else {
            return [];
          }
        })
        .catch((err) => {
          console.log(`ERROR FROM AP ${err}`);
          return [];
        });

      output = { ...output, A: ap };

      const profit = await sql
        .connect(sqlConfig)
        .then((pool) => {
          return pool
            .request()
            .query(`select * from V_PROFIT_H where ${HouseQuery};`);
        })
        .then((result) => {
          if (result.rowsAffected[0]) {
            return result.recordsets[0];
          } else {
            return [];
          }
        })
        .catch((err) => {
          console.log(`ERROR FROM PROFIT ${err}`);
          return [];
        });

      output = { ...output, P: profit };

      const invoice = await sql
        .connect(sqlConfig)
        .then((pool) => {
          return pool
            .request()
            .query(`select * from T_INVOHD where ${HouseQuery};`);
        })
        .then((result) => {
          // console.log(result);
          if (result.rowsAffected[0]) {
            return result.recordsets[0];
          } else {
            return [];
          }
        })
        .catch((err) => {
          console.log(`ERROR FROM INVOICE ${err}`);
          return [];
        });

      output = { ...output, I: invoice };

      const crdr = await sql
        .connect(sqlConfig)
        .then((pool) => {
          return pool
            .request()
            .query(`select * from T_CRDBHD where ${HouseQuery};`);
        })
        .then((result) => {
          // console.log(result);
          if (result.rowsAffected[0]) {
            return result.recordsets[0];
          } else {
            return [];
          }
        })
        .catch((err) => {
          console.log(`ERROR FROM CRDR ${err}`);
          return [];
        });
      output = { ...output, CR: crdr };
    }
  }
  res.status(200).send(output);
  return sql.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
