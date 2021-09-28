const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
	let pool = new sql.ConnectionPool(process.env.SERVER2);
	const qry = `SELECT TOP 100 *, (SELECT T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_DEPOHD.F_PaidTo) as PAY, (SELECT T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_DEPOHD.F_BillTo) as BILL, (SELECT T_CODEBANK.F_BankName from T_CODEBANK where F_DepositBank=T_CODEBANK.F_ID) as BANK FROM T_DEPOHD WHERE F_Type='C' ORDER BY F_U1Date DESC;`;

	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		if (!token.admin) {
			res.send("ACCESS DENIED");
			return;
		}
		await pool.connect();
		let result = await pool.request().query(qry);
		res.send(result.recordsets[0]);
	} catch (err) {
		res.send(err);
	}
	return pool.close();
};

export const config = {
	api: {
		externalResolver: true,
	},
};

// const sql = require("mssql");
// const jwt = require("jsonwebtoken");

// const sqlConfig = {
//   server: process.env.JWDB_SVR,
//   database: process.env.JWDB_1,
//   user: process.env.JWDB_USER,
//   password: process.env.JWDB_PASS,
//   options: {
//     appName: "FMS",
//     encrypt: false,
//     enableArithAbort: false,
//   },
// };
// export default async (req, res) => {
//   //Get Access token from the client side and filter the access
//   const token = jwt.decode(req.headers.key);

//   if (!token.admin) {
//     res.status(401).send("Unauthorized");
//     return;
//   }

//   const HD = `SELECT TOP 100 *, (SELECT T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_DEPOHD.F_PaidTo) as PAY, (SELECT T_COMPANY.F_SName from T_COMPANY where T_COMPANY.F_ID = T_DEPOHD.F_BillTo) as BILL, (SELECT T_CODEBANK.F_BankName from T_CODEBANK where F_DepositBank=T_CODEBANK.F_ID) as BANK FROM T_DEPOHD WHERE F_Type='C' ORDER BY F_U1Date DESC;`;

//   (async function () {
//     try {
//       let pool = await sql.connect(sqlConfig);
//       let result1 = await pool.request().query(HD);
//       res.status(200).send(result1.recordsets[0]);
//     } catch (err) {
//       res.status(400).send(err);
//     }
//   })();
//   sql.on("error", (err) => {
//     console.log(err);
//   });
// };

// export const config = {
//   api: {
//     externalResolver: true,
//   },
// };
