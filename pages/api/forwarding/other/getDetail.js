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

  const MASTER = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_GENMAIN.F_Customer) as CUSTOMER, T_GENMAIN.*, T_AOTHERINFO.F_C1, T_AOTHERINFO.F_C2, T_AOTHERINFO.F_C3, T_AOTHERINFO.F_C4 from T_GENMAIN join T_AOTHERINFO on T_GENMAIN.F_ID = T_AOTHERINFO.F_TBID and T_AOTHERINFO.F_TBNAME='T_GENMAIN' WHERE F_RefNo='${req.headers.reference}';`;

  var output = { M: [], H: [], C: false, A: [], P: false, I: [], CR: [] };

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
        return false;
      }
    })
    .catch((err) => {
      console.log(`ERROR FROM MASTER ${err}`);
      return false;
    });
  output = { ...output, M: master };

  if (master) {
    var HouseQuery = `F_TBID='${master.F_ID}' AND F_TBName='T_GENMAIN'`;
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
          .query(`select * from V_PROFIT_Master where ${HouseQuery};`);
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
  res.status(200).send(output);
  return sql.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
