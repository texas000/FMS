const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(400).json([]);
    return;
  }
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  var query = `select distinct VENDOR from T_REQUEST_AP;`;
  try {
    await pool.connect();
    let result = await pool.request().query(query);

    res
      .status(200)
      .send(
        Object.keys(result.recordset).map(
          (ga) => result.recordset[ga].VENDOR
        ) || []
      );
  } catch (err) {
    console.log(err);
    res.json([]);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
