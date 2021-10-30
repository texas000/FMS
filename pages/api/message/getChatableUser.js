const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

export default async (req, res) => {
  const rawCookie = req.headers.cookie || "";
  const cookies = cookie.parse(rawCookie);
  // VERIFY IF TOKEN IS VALID
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    let pool = new sql.ConnectionPool(process.env.SERVER21);
    // CONNECT TO DB
    try {
      await pool.connect();
      let result = await pool
        .request()
        .query(
          `SELECT F_ID, F_FNAME, F_LNAME, F_GROUP, F_SlackID FROM T_MEMBER where F_STATUS<>0 AND F_ID<>5 AND F_ID<>'${token.uid}' ORDER BY F_GROUP ASC;`
        );
      res.json(result.recordset);
    } catch (err) {
      res.json(err);
    }
    return pool.close();
  } catch (err) {
    res.status(500).send("NO TOKEN");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
