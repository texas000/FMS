var request = require("request");
export default async (req, res) => {
	const { ref, file } = req.query;
	if (!ref || !file) {
		res.status(400).send("BAD REQUEST");
		return;
	}
	request
		.get(`http://jameswgroup.com:49991/api/forwarding/${ref}/${file}`)
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
