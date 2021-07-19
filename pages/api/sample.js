var request = require("request");
export default async (req, res) => {
	request
		.get("http://jameswgroup.com:49991/api/forwarding/test/image.png")
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
