const sql = require("mssql");

export default async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).send("BAD REQUEST");
    return;
  }

  let pool = new sql.ConnectionPool(process.env.SERVER2);
  const qry = `SELECT TOP 5 * FROM T_DEPOHD WHERE F_BillTo='${q}' ORDER BY F_U1Date DESC;`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.status(200).send(result?.recordset);
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
