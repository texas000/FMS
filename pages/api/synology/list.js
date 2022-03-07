var request = require("request");
var cookie = require("cookie");
var jwt = require("jsonwebtoken");
export default async (req, res) => {
	const path = req.query.path;
	const cookies = cookie.parse(req.headers.cookie || "");
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	if (path) {
		var url = `${
			process.env.SYNOLOGY_BASEURL
		}webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list&folder_path=${encodeURIComponent(
			path
		)}&_sid=${token.sid}`;
	} else {
		var url = `${process.env.SYNOLOGY_BASEURL}webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list_share&_sid=${token.sid}`;
	}
	request.get(url).pipe(res);
};
