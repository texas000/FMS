const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

export default async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send("NO ID PROVIDED");
    return;
  }
  const rawCookie = req.headers.cookie || "";
  const cookies = cookie.parse(rawCookie);
  // VERIFY IF TOKEN IS VALID
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    let pool = new sql.ConnectionPool(process.env.SERVER21);
    // CONNECT TO DB
    try {
      await pool.connect();
      let result = await pool.request().query(
        `SELECT DISTINCT TOP 50 M.F_ID, M.F_UID, M.F_BODY, M.F_DATE, 
                    (SELECT F_FNAME FROM T_MEMBER MEM WHERE MEM.F_ID=M.F_UID) AS CREATOR 
                    FROM T_MESSAGE_RECIPIENT R JOIN T_MESSAGE M on M.F_ID=R.F_MESSAGEID 
                    WHERE (R.F_UID='${token.uid}' AND M.F_UID='${id}') OR (R.F_UID='${id}' AND M.F_UID='${token.uid}') ORDER BY F_ID DESC;`
      );
      res.status(200).json(result.recordset);
    } catch (err) {
      console.log(err);
      res.status(404).json([]);
    }
    return pool.close();
  } catch (err) {
    res.status(500).json([]);
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
