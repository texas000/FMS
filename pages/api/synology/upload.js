var request = require("request");
var formidable = require("formidable");
var fs = require("fs");
var cookie = require("cookie");
var jwt = require("jsonwebtoken");

export default async (req, res) => {
	const cookies = cookie.parse(req.headers.cookie || "");
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	var url = `${process.env.SYNOLOGY_BASEURL}webapi/entry.cgi?_sid=${token.sid}`;

	const promise = new Promise((resolve, reject) => {
		var form = new formidable.IncomingForm({ keepExtensions: true });
		form.parse(req, function (err, fields, files) {
			if (err) {
				reject(err);
			}
			resolve({ fields, files });
		});
	});
	return promise.then(({ fields, files }) => {
		request
			.post({
				url: url,
				method: "POST",
				formData: {
					api: "SYNO.FileStation.Upload",
					version: "2",
					method: "upload",
					path: req.headers.path,
					create_parents: "true",
					_sid: token.sid,
					file: {
						value: fs.createReadStream(files.file.path),
						options: { filename: files.file.name, contentType: null },
					},
				},
			})
			.pipe(res);
	});
};
export const config = {
	api: {
		externalResolver: true,
		bodyParser: false,
	},
};
