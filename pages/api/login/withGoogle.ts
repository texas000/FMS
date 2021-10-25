import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import jwt from "jsonwebtoken";

export default function (req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve) => {
    if (!req.body) {
      res.status(404).end();
    }

    const { email, displayName, photoURL } = req.body;
    const pool = new sql.ConnectionPool(process.env.SERVER21);
    pool.on("error", (err) => {
      console.log("sql error", err);
    });
    await pool.connect();

    const USER = `SELECT * from T_MEMBER WHERE F_EMAIL='${email}';`;
    const UPDATEQRY = `UPDATE T_MEMBER SET F_ISLOGIN='TRUE', F_BROWSER='${
      req.headers["user-agent"]
    }', F_LASTACCESSDATE=GETDATE(), F_IP='${req.connection.remoteAddress.replace(
      "::ffff:",
      ""
    )}' WHERE F_EMAIL='${email}';`;

    try {
      let result = await pool.request().query(USER + UPDATEQRY);
      if (result.rowsAffected[0]) {
        res.json({
          token: jwt.sign(
            {
              username: result.recordset[0].F_ACCOUNT,
              uid: result.recordset[0].F_ID,
              admin: parseInt(result.recordset[0].F_STATUS),
              group: parseInt(result.recordset[0].F_GROUP),
              email: result.recordset[0].F_EMAIL || false,
              first: result.recordset[0].F_FNAME,
              last: result.recordset[0].F_LNAME,
              fsid: result.recordset[0].F_FSID,
              displayName: displayName,
              photoURL: photoURL,
            },
            process.env.JWT_KEY
          ),
        });
      } else {
        res.json(false);
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
