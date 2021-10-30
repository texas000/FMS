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
    const body = JSON.parse(req.body);
    // CONNECT TO DB
    try {
      await pool.connect();
      let result = await pool.request().query(
        `INSERT INTO T_MESSAGE VALUES
            (N'${body.message.replace(/'/g, "''")}', '/chat?user=${
          token.uid
        }', GETDATE(), '${token.uid}');
            INSERT INTO T_MESSAGE_RECIPIENT VALUES ('${
              body.sendto
            }', NULL, @@IDENTITY, 0);`
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
