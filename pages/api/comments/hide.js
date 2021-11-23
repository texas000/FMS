const cookies = require("cookie");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

export default async (req, res) => {
  const { id } = req.query;
  const parsed = cookies.parse(req.headers.cookie);
  const token = jwt.verify(parsed.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(400).send("NO TOKEN");
    return;
  }
  if (!id) {
    res.status(400).send("BAD REQUEST");
    return;
  }
  try {
    let pool = new sql.ConnectionPool(process.env.SERVER21);
    const qry = `UPDATE T_COMMENTS SET F_Show='0' WHERE F_ID='${id}';`;
    try {
      await pool.connect();
      let result = await pool.request().query(qry);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
    return pool.close();
  } catch (err) {
    res.status(400).json(err);
    return;
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
