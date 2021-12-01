const sql = require("mssql");

export default async (req, res) => {
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  const qry = `SELECT TOP 1 * FROM T_BOARD ORDER BY ID DESC;`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(400).json(err.toString());
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
