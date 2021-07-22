const sql = require("mssql");

export default async (req, res) => {
	const { ref } = req.query;

	const MASTER = `select (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID =T_OOMMAIN.F_Agent) as AGENT,
  (select T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_OOMMAIN.F_Carrier) as CARRIER,
  * from T_OOMMAIN WHERE F_RefNo='${ref}';`;

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
		output = { ...output, M: master.recordset[0] };
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
						return ` OR F_TBID='${ga.F_ID}' AND F_TBName='T_OIHMAIN'`;
					} else {
						return `F_TBID='${ga.F_ID}' AND F_TBName='T_OIHMAIN'`;
					}
				});
				houses = houses.join("");
				let ap = await pool
					.request()
					.query(
						`select T_APHD.*, T_COMPANY.F_Addr, T_COMPANY.F_City, T_COMPANY.F_State, T_COMPANY.F_ZipCode, T_COMPANY.F_SName, T_COMPANY.F_IRSNo, T_COMPANY.F_IRSType from T_APHD INNER JOIN T_COMPANY ON F_PayTo=T_COMPANY.F_ID WHERE ${houses};`
					);
				output.A = ap.recordset;
				let profit = await pool
					.request()
					.query(`select * from V_PROFIT_H where ${houses};`);
				output.P = profit.recordset;
				let invoice = await pool
					.request()
					.query(`select * from T_INVOHD where ${houses};`);
				output.I = invoice.recordset;
				let crdr = await pool
					.request()
					.query(`select * from T_CRDBHD where ${houses};`);
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
