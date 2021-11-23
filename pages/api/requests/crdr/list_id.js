const sql = require("mssql");

export default async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send({ error: true, message: "Bad Request" });
    return;
  }

  let pool = new sql.ConnectionPool(process.env.SERVER21);
  const qry = `select *, (select F_FNAME from T_MEMBER where T_MEMBER.F_ID=T_REQUEST_CRDR.CREATEDBY) as CREATOR from T_REQUEST_CRDR where TBID=${id}`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.status(200).send({ error: false, data: result.recordset });
  } catch (err) {
    res.status(400).send({ error: true, message: err.toString() });
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
