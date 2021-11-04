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
  const body = JSON.parse(req.body);
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    let result = await pool
      .request()
      .query(
        `INSERT INTO T_PAYMENT_CODE VALUES('${body.method}', ${
          body.detail ? `'${body.detail}'` : "NULL"
        }, 1, ${body.expire ? `'${body.expire}-01'` : "NULL"});`
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
