import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import jwt from "jsonwebtoken";

export default function (req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve) => {
    if (!req.body) {
      res.status(404).end();
    }

    const { username, password } = req.body;

    const safeUsername = username.replace("'", "''");
    const safePassword = password.replace("'", "''");

    const pool = new sql.ConnectionPool(process.env.SERVER21);
    pool.on("error", (err) => {
      console.log("sql error", err);
    });
    await pool.connect();

    const query = `SELECT * from T_MEMBER WHERE F_ACCOUNT='${safeUsername}' AND F_PASSWORD='${safePassword}';
    UPDATE T_MEMBER SET F_ISLOGIN='TRUE', F_LASTACCESSDATE=GETDATE() WHERE F_ACCOUNT='${safeUsername}' AND F_PASSWORD='${safePassword}';`;

    try {
      let result = await pool.request().query(query);
      if (result.rowsAffected[0]) {
        const user = result.recordset[0];
        
        // logout before login
        await fetch(`http://jwi.synology.me:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=logout&session=FileStation`)

        var url = `http://jwi.synology.me:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${user.F_Address}&passwd=${user.F_PersonalEmail}&session=FileStation&format=sid`;
        const reqSid = await fetch(url)
        const sidjson = await reqSid.json();
        res.json({
          token: jwt.sign(
            {
              username: safeUsername,
              uid: user.F_ID,
              admin: parseInt(user.F_STATUS),
              group: parseInt(user.F_GROUP),
              email: user.F_EMAIL || false,
              first: user.F_FNAME,
              last: user.F_LNAME,
              fsid: user.F_FSID,
              nas_account: user.F_Address,
              nas_passwd: user.F_PersonalEmail,
              sid: sidjson.success ? sidjson.data.sid : false,
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
