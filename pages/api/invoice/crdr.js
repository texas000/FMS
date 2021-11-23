const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const rawCookie = req.headers.cookie || "";
  const cookies = cookie.parse(rawCookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  let pool = new sql.ConnectionPool(process.env.SERVER2);
  const { q } = req.query;

  try {
    await pool.connect();
    let result = await pool
      .request()
      .query(
        `select top 1 *, (SELECT F_SName FROM T_COMPANY WHERE F_ID=T_CRDBHD.F_Agent) as AGENT from T_CRDBHD where F_ID='${q}';`
      );
    if (result.recordset.length) {
      let detail = await pool
        .request()
        .query(
          `SELECT * FROM T_CRDBDETAIL WHERE F_CRDBHDID='${result.recordset[0].F_ID}'`
        );
      let summary = await pool
        .request()
        .query(
          `SELECT * FROM V_CRDB WHERE F_ID='${result.recordset[0].F_ID}';`
        );
      res.status(200).send({
        ...result.recordset[0],
        error: false,
        summary: summary.recordset[0],
        detail: detail.recordset,
      });
    } else {
      res.status(400).send({ error: true, message: "Invoice not found" });
    }
  } catch (err) {
    res.status(500).send({ error: true, message: err.toString() });
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
