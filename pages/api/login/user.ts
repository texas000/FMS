import { NextApiRequest, NextApiResponse } from "next";
import moment from 'moment'
import sql from "mssql";
import jwt from "jsonwebtoken";

const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_3,
  user: process.env.JWDB_USER,
  password: process.env.JWDB_PASS,
  options: {
    appName: "test",
    encrypt: false,
    enableArithAbort: false,
    database: process.env.JWDB_2,
  },
};

export default function (req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve) => {
    if (!req.body) {
      res.status(404).end();
    }

    const { username, password } = req.body;

    const pool = new sql.ConnectionPool(SQLconfig);
    pool.on("error", (err) => {
      console.log("sql error", err);
    });
    await pool.connect();
    
    const USER = `SELECT * from T_MEMBER WHERE F_ACCOUNT='${username}' AND F_PASSWORD='${password}';`
    const UPDATEQRY = `UPDATE T_MEMBER SET F_ISLOGIN='TRUE', F_BROWSER='${req.headers["user-agent"]}', F_LASTACCESSDATE=GETDATE(), F_IP='${req.connection.remoteAddress.replace('::ffff:','')}' WHERE F_ACCOUNT='${username}' AND F_PASSWORD='${password}';`

    try {
      let result = await pool
        .request()
        .query(USER+UPDATEQRY);
        if(result.rowsAffected[0]) {
          res.json({
            token: jwt.sign(
              {
                username,
                uid: result.recordset[0].F_ID,
                admin: result.recordset[0].F_GROUP == "1",
                group: parseInt(result.recordset[0].F_GROUP),
                email: result.recordset[0].F_EMAIL || false,
                first: result.recordset[0].F_FNAME,
                last: result.recordset[0].F_LNAME,
                fsid: result.recordset[0].F_FSID
              },
              process.env.JWT_KEY
            ),
          });
        } else {
          res.json(false)
        }
    } catch (err) {
      console.log(err);
    } finally {
      pool.close();
    }
  });
}

export const config = {
  api: {
    externalResolver: true,
  },
};
