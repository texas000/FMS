var cookie = require("cookie");
var jwt = require("jsonwebtoken");
var request = require("request");
export default async (req, res) => {
	const path = req.query.path;
	const mode = '"open"'; // download
	const cookies = cookie.parse(req.headers.cookie || "");
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	var url = `${
		process.env.SYNOLOGY_BASEURL
	}webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent(
		path
	)}&mode=${encodeURIComponent(mode)}&_sid=${token.sid}`;

	request
		.get(url)
		.pipe(res)
		.on("error", function (err) {
			console.log(err);
		});
};
