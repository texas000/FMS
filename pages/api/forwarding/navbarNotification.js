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
  } else {
    const master = await sql
      .connect(sqlConfig)
      .then((pool) => {
        return pool
          .request()
          .query(
            `SELECT TOP 10 * FROM T_OIMMAIN WHERE F_U2ID='${req.headers.uid}' ORDER BY F_ID DESC;`
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
        console.log(err);
        return [];
      });
    res.status(200).send(master);
  }
  return sql.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
