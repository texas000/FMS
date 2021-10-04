const sql = require("mssql");

export default async (req, res) => {
  const { id } = req.query;
  let pool = new sql.ConnectionPool(process.env.SERVER2);
  if (!id) {
    res.status(400).send("ID MUST BE PROVIDED");
    return;
  }
  try {
    await pool.connect();
    let result = await pool
      .request()
      .query(`select * from T_INVODETAIL where F_INVOHDID=${id};`);
    res.status(200).send(result.recordset);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
