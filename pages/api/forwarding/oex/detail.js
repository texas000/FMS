const sql = require("mssql");

export default async (req, res) => {
  const { ref } = req.query;

  const MASTER = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID =T_OOMMAIN.F_Agent) as AGENT,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OOMMAIN.F_Carrier) as CARRIER,
  * from T_OOMMAIN WHERE F_RefNo='${ref.replace(/'/g, "''")}';`;

  const HOUSE = `SELECT (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OOHMAIN.F_Customer) as CUSTOMER,
    (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OOHMAIN.F_Consignee) as CONSIGNEE,
    (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OOHMAIN.F_Notify) as NOTIFY,
    (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OOHMAIN.F_Shipper) as SHIPPER, * FROM 
    T_OOHMAIN WHERE F_OOMBLID=`;

  const CONTAINER = `SELECT T_OOMCONTAINER.*, T_OOHCONTAINER.F_OOHBLID as F_OOHBLID from T_OOMCONTAINER
    LEFT JOIN T_OOHCONTAINER on T_OOMCONTAINER.F_ID = T_OOHCONTAINER.F_OOMCNTID where F_OOMBLID=`;

  var output = { M: false, H: [], C: [], A: [], P: [], I: [], CR: [] };
  let pool = new sql.ConnectionPool(process.env.SERVER2);

  try {
    await pool.connect();
    let master = await pool.request().query(MASTER);
    output = { ...output, M: master.recordset[0] || false };
    if (master.recordset.length) {
      let house = await pool
        .request()
        .query(HOUSE + `'${master.recordset[0].F_ID}'`);
      output.H = house.recordset;
      let container = await pool
        .request()
        .query(CONTAINER + `'${master.recordset[0].F_ID}'`);
      output.C = container.recordset;
      if (house.recordset.length) {
        var houses = house.recordset.map((ga, i) => {
          if (i) {
            return ` OR F_TBID='${ga.F_ID}' AND F_TBName='T_OOHMAIN'`;
          } else {
            return `F_TBID='${ga.F_ID}' AND F_TBName='T_OOHMAIN'`;
          }
        });
        houses = houses.join("");
        let ap = await pool
          .request()
          .query(
            `SELECT *, (SELECT F_SName FROM T_COMPANY C WHERE C.F_ID=A.F_PayTo) as VENDOR FROM T_APHD A WHERE ${houses};`
          );
        output.A = ap.recordset;
        let profit = await pool
          .request()
          .query(`select top 1 * from V_PROFIT_H where ${houses};`);
        output.P = profit.recordset;
        let invoice = await pool.request().query(`SELECT *, 
					(SELECT F_SName FROM T_COMPANY C WHERE I.F_BillTo=C.F_ID) AS BILLTO, 
					(SELECT F_SName FROM T_COMPANY C WHERE I.F_ShipTo=C.F_ID) AS SHIPTO 
					from T_INVOHD I where ${houses};`);
        output.I = invoice.recordset;
        let crdr = await pool
          .request()
          .query(
            `select *, (SELECT F_SName FROM T_COMPANY C WHERE C.F_ID=CR.F_Agent) AS AGENT FROM T_CRDBHD CR where ${houses};`
          );
        output.CR = crdr.recordset;
      }
    }
    res.json(output);
  } catch (err) {
    res.json(err);
  }
  return pool.close();
};

export const config = {
  api: {
    externalResolver: true,
  },
};
