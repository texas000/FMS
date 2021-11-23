const cookies = require("cookie");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

export default async (req, res) => {
  const { tbid, tbname } = req.query;
  if (!tbid || !tbname) {
    res.status(402).send({ error: false, message: "Request Failed" });
    return;
  }

  const parsed = cookies.parse(req.headers.cookie);
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    const token = jwt.verify(parsed.jamesworldwidetoken, process.env.JWT_KEY);

    const qry = `INSERT INTO T_COMMENTS VALUES ('${tbname}', '${tbid}',
        N'${req.body.content.replace("'", "''")}', 
        ${token.uid}, GETDATE(), '1', ${
      req.body.link ? `'${req.body.link}'` : "NULL"
    });`;
    try {
      await pool.connect();
      let result = await pool.request().query(qry);
      res.status(200).send({ error: false, message: "Message sent" });
    } catch (err) {
      res.status(400).send({ error: false, message: err.toString() });
    }
  } catch (err) {
    res.status(400).send({ error: false, message: err.toString() });
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
