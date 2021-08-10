const cookies = require("cookie");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

export default async (req, res) => {
	const { ref } = req.query;
	if (!ref) {
		res.status(400).send("BAD REQUEST");
		return;
	}

	const parsed = cookies.parse(req.headers.cookie);
	try {
		const token = jwt.verify(parsed.jamesworldwidetoken, process.env.JWT_KEY);

		let pool = new sql.ConnectionPool(process.env.SERVER21);
		const qry = `INSERT INTO T_FREIGHT_COMMENT VALUES ('${ref}', 
        N'${req.body.content.replace("'", "''")}', 
        ${token.uid}, GETDATE(), '1', NULL);`;
		try {
			await pool.connect();
			let result = await pool.request().query(qry);
			res.json(result);
		} catch (err) {
			console.log(err);
			res.json(err);
		}
		return pool.close();
	} catch (err) {
		res.status(400).json(err);
		return;
	}
};

export const config = {
	api: {
		externalResolver: true,
	},
};
