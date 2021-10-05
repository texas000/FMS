const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.send("ACCESS DENIED");
    return;
  }
  const { id, email } = req.query;
  if (!id || !email) {
    res.send("INVALID ENTRY");
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool
      .request()
      .query(
        `DELETE T_COMPANY_CONTACT WHERE COMPANY_ID='${id}' AND EMAIL='${decodeURIComponent(
          email
        )}' AND UPDATE_USER='${token.uid}';`
      );
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
  return pool.close();
};
