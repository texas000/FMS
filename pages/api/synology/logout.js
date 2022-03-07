var request = require("request");
export default async (req, res) => {
	var url = `${process.env.SYNOLOGY_BASEURL}webapi/auth.cgi?api=SYNO.API.Auth&version=1&method=logout&session=FileStation`;
	request.get(url).pipe(res);
};
