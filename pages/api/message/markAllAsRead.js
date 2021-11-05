// * FRONT
// NAVBAR NOTIFICATION BADGE

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
          `UPDATE T_MESSAGE_RECIPIENT SET F_READ=1 WHERE F_UID='${token.uid}';`
        );
      res.json(result.rowsAffected[0]);
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
