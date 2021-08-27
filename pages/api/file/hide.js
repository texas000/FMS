const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

// * F_SECURITY LEVEL
// ! HIDE - 0
// ! INVOICE - 10
// ! CRDR - 20
// ! AP - 30

export default async (req, res) => {
	var { q } = req.query;
	if (!q) {
		res.status(500).send("NO QUERY");
		return;
	}
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	// VERIFY IF TOKEN IS VALID
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		if (!token.admin) {
			res.status(500).send("NO TOKEN");
			return;
		}
		let pool = new sql.ConnectionPool(process.env.SERVER21);
		// CONNECT TO DB
		try {
			await pool.connect();
			let result = await pool
				.request()
				.query(`UPDATE T_FILE SET F_SECURITY='0' WHERE F_ID=${q};`);
			res.json(result.rowsAffected[0]);
		} catch (err) {
			res.json(err);
		}
		return pool.close();
	} catch (err) {
		res.status(500).send("NO TOKEN");
	}
};

export const config = {
	api: {
		externalResolver: true,
	},
};
