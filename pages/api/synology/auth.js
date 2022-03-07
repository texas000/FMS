var request = require("request");
export default async (req, res) => {
	var account = req.query.account;
	var passwd = req.query.passwd;
	var url = `${process.env.SYNOLOGY_BASEURL}webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${account}&passwd=${passwd}&session=FileStation&format=sid`;

	request.get(url).pipe(res);
};
