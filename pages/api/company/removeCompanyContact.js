const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(401).send({ error: true, msg: "Unauthorized" });
    return;
  }
  const { id, email } = req.query;
  if (!id || !email) {
    res.status(400).send({ error: true, msg: "Bad Request" });
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    await pool
      .request()
      .query(
        `DELETE T_COMPANY_CONTACT WHERE COMPANY_ID='${id}' AND EMAIL='${decodeURIComponent(
          email
        )}';`
      );
    res.status(200).send({ error: false, msg: "Contact Removed Successfully" });
  } catch (err) {
    res
      .status(403)
      .send({
        error: false,
        msg: err.originalError?.info?.message || "403 ERROR!",
      });
  }
  return pool.close();
};
