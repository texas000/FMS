const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  var cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (token.admin < 4) {
    res.status(400).json("Unauthorized");
    return;
  }
  const body = JSON.parse(req.body);
  if (!body.request.length) {
    res.status(400).send("Error: Please select the account payable");
    return;
  }
  var id = body.request.map((ga, i) => {
    if (i) {
      return ` OR ID='${ga}'`;
    } else {
      return `ID='${ga}'`;
    }
  });
  id = id.join("");
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  var query = `UPDATE T_REQUEST_AP SET STATUS='131' WHERE ${id}`;
  try {
    await pool.connect();
    let result = await pool.request().query(query);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
