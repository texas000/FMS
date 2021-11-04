const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

// In order to get payment code for account payable request transaction
export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(401).send({ error: true, msg: "Unauthorized" });
  }
  const { id, status } = req.query;
  if (!id) {
    res.status(400).send({ error: true, msg: "ID Not Provided" });
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool
      .request()
      .query(
        `UPDATE T_PAYMENT_CODE SET F_ACTIVE='${status}' WHERE F_ID='${id}';`
      );
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(400).send({ error: true, msg: JSON.stringify(err) });
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
