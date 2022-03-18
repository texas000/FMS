const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
// const req = {
//   101: "REQUESTED",
//   110: "DIRECTOR REJECTED",
//   111: "DIRECTOR",
//   120: "ACCOUNTING REJECTED",
//   121: "APPROVED",
//   131: "APPROVED BY CEO",
// };

// const level = {
//   0: 'SUSPENDED',
//   1: 'OPERATOR',
//   2: '',
//   3: '',
//   4: '',
//   5: 'MANAGER',
//   6: 'DIRECTOR',
//   7: 'ACCOUNTING',
//   8: '',
//   9: 'ADMIN',
// }

export default async (req, res) => {
	var { ref } = req.query;
	var cookies = cookie.parse(req.headers.cookie);
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	if (!token.admin) {
		res.status(400).json([]);
		return;
	}
	var query;
	// OPERATOR
	if (token.admin < 5) {
		query = `SELECT TOP 1000 *,
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) as Creator, 
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER2) as USER_2,
    (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER3) as USER_3
    FROM T_REQUEST_AP WHERE CREATEDBY='${token.uid}' ORDER BY CREATED DESC`;
	}
	// DIRECTOR / MANAGER
	// QUERY BY URGENT - (STATUS 101, 111 APPEAR PRIOR, REST - FOLLOW THE SAME LOGIC)
	if (token.admin >= 5) {
		query = `SELECT * FROM(
      SELECT *, (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) as Creator, 
          (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER2) as USER_2,
          (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER3) as USER_3 from T_REQUEST_AP where (status = '101' or status = '111' ) and urgent = 1
         ) A
      UNION ALL
      SELECT * FROM(
      SELECT TOP 2000 * , (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=CREATEDBY) as Creator, 
          (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER2) as USER_2,
          (SELECT F_FNAME FROM T_MEMBER M WHERE M.F_ID=USER3) as USER_3 from T_REQUEST_AP  where not ((status = '101' or status = '111') and urgent=1) ORDER BY ID DESC
          ) B`;
	}
	if (ref) {
		query = `SELECT * FROM T_REQUEST_AP WHERE RefNo='${ref}'`;
	}
	let pool = new sql.ConnectionPool(process.env.SERVER21);
	try {
		await pool.connect();
		let result = await pool.request().query(query);
		res.status(200).send(result.recordset || []);
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
