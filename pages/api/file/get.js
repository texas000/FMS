var request = require("request");
export default async (req, res) => {
	const { ref, file } = req.query;
	if (!ref || !file) {
		res.status(400).send("BAD REQUEST");
		return;
	}
	var decoded = decodeURIComponent(file);
	request
		.get(
			`http://jameswi.com:49991/api/forwarding/${ref}/${encodeURIComponent(
				decoded
			)}`
		)
		.on("error", function (err) {
			console.log(err);
			res.status(404).send("NOT FOUND");
			return;
		})
		.pipe(res);
};

export const config = {
	api: {
		externalResolver: true,
	},
};
