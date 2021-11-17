const sql = require("mssql");

export default async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).send("BAD REQUEST");
    return;
  }

  let pool = new sql.ConnectionPool(process.env.SERVER2);
  const qry = `select (select count(*) from T_APHD where F_PayTo='${q}') as AP,
	(select count(*) from T_INVOHD where F_BillTo='${q}' and F_InvoiceAmt<>'0') as INV,
   (select count(*) from T_CRDBHD where F_Agent='${q}' and F_Total<>'0') as CR`;
  try {
    await pool.connect();
    let result = await pool.request().query(qry);
    res.status(200).send(result?.recordset[0]);
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
