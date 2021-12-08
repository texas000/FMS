const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

export default async function handler(req, res) {
  const rawCookie = req.headers.cookie || "";
  const cookies = cookie.parse(rawCookie);

  // ENABLE API KEY
  // const auth = req.headers.authorization;
  // if (auth !== process.env.API_KEY) {
  // 	res.status(401).json({ err: 401, msg: "Unauthorized" });
  // 	return;
  // }

  try {
    // GET TOKEN FROM COOKIE
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    if (!token.admin) {
      res.status(400).send("ACCESS DENIED");
      return;
    }
    // CREATE SQL POOL CONNECTION
    let pool = new sql.ConnectionPool(process.env.SERVER2);
    try {
      // WAIT TIL POOL CONNECT
      await pool.connect();
      // GET DATE AND ADD A MONTH (ETA FROM TODAY TO NEXT MONTH)
      var date = new Date();
      date.setDate(date.getDate() + 30);
      var from = new Date();
      from.setDate(date.getDate() - 7);

      var qry;
      if (token.admin > 4) {
        qry = `select distinct M.F_ID, M.F_RefNo, F_ETA, (select F_SName from T_COMPANY C where C.F_ID=H.F_Customer) as Customer from T_OIMMAIN M left join T_OIHMAIN H on (M.F_ID=H.F_OIMBLID) where F_ETA BETWEEN GETDATE() AND '${date.toLocaleDateString()}' ORDER BY M.F_ETA ASC;
				select distinct M.F_ID, M.F_RefNo, F_ETA, (select F_SName from T_COMPANY C where C.F_ID=H.F_Customer) as Customer from T_OOMMAIN M left join T_OOHMAIN H on (M.F_ID=H.F_OOMBLID) where F_ETA BETWEEN GETDATE() AND '${date.toLocaleDateString()}' ORDER BY M.F_ETA ASC;
				select distinct M.F_ID, M.F_RefNo, F_ETA, (select F_SName from T_COMPANY C where C.F_ID=H.F_Customer) as Customer from T_AIMMAIN M left join T_AIHMAIN H on (M.F_ID=H.F_AIMBLID) where F_ETA BETWEEN GETDATE() AND '${date.toLocaleDateString()}' ORDER BY M.F_ETA ASC;
				select distinct M.F_ID, M.F_RefNo, F_ETA, (select F_SName from T_COMPANY C where C.F_ID=H.F_Customer) as Customer from T_AOMMAIN M left join T_AOHMAIN H on (M.F_ID=H.F_AOMBLID) where F_ETA BETWEEN GETDATE() AND '${date.toLocaleDateString()}' ORDER BY M.F_ETA ASC;`;
      } else {
        qry = `select distinct M.F_ID, M.F_RefNo, F_ETA, (select F_SName from T_COMPANY C where C.F_ID=H.F_Customer) as Customer from T_OIMMAIN M left join T_OIHMAIN H on (M.F_ID=H.F_OIMBLID) where M.F_U2ID='${
          token.fsid
        }' AND F_ETA BETWEEN '${from.toLocaleDateString()}' AND '${date.toLocaleDateString()}' ORDER BY M.F_ETA ASC;
				select distinct M.F_ID, M.F_RefNo, F_ETA, (select F_SName from T_COMPANY C where C.F_ID=H.F_Customer) as Customer from T_OOMMAIN M left join T_OOHMAIN H on (M.F_ID=H.F_OOMBLID) where M.F_U2ID='${
          token.fsid
        }' AND F_ETA BETWEEN '${from.toLocaleDateString()}' AND '${date.toLocaleDateString()}' ORDER BY M.F_ETA ASC;
				select distinct M.F_ID, M.F_RefNo, F_ETA, (select F_SName from T_COMPANY C where C.F_ID=H.F_Customer) as Customer from T_AIMMAIN M left join T_AIHMAIN H on (M.F_ID=H.F_AIMBLID) where M.F_U2ID='${
          token.fsid
        }' AND F_ETA BETWEEN '${from.toLocaleDateString()}' AND '${date.toLocaleDateString()}' ORDER BY M.F_ETA ASC;
				select distinct M.F_ID, M.F_RefNo, F_ETA, (select F_SName from T_COMPANY C where C.F_ID=H.F_Customer) as Customer from T_AOMMAIN M left join T_AOHMAIN H on (M.F_ID=H.F_AOMBLID) where M.F_U2ID='${
          token.fsid
        }' AND F_ETA BETWEEN '${from.toLocaleDateString()}' AND '${date.toLocaleDateString()}' ORDER BY M.F_ETA ASC;`;
      }
      // GET RESULT FROM SQL QUERY
      let result = await pool.request().query(qry);
      // SEND RESULT
      res.json(result.recordsets);
    } catch (err) {
      // IF ERROR, SEND ERROR - POSSIBLE ERROR: BAD QUERY
      res.status(400).json(err);
    }
    return pool.close();
  } catch (err) {
    // IF ERROR SEND CORRESPONDING ERROR
    // POSSIBLE ERROR - JWT ERROR & SQL CONNECTION ERROR
    if (err) {
      res.status(403).json(err);
      return;
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
