var request = require("request");
var path = require("path");

export default async (req, res) => {
	const { ref } = req.query;
	if (!ref) {
		res.status(400).send("BAD REQUEST");
		return;
	}
	// Define Request Options, *** USE ENV VALUE FOR BASE URI ***
	var options = {
		method: "GET",
		url: `http://jameswgroup.com:49991/api/forwarding/${ref}`,
		headers: {
			"cache-control": "no-cache",
			accept: "application/json",
			"content-type": "multipart/form-data",
			"x-api-key": process.env.JWT_KEY,
		},
		json: true,
	};

	request(options, function (error, response, body) {
		// IF ERROR, THROW ERROR
		if (error) throw new Error(error);
		// console.log(response);
		// IF RESPONSE IS 200, SEND THE BODY WITH 200 STATUS CODE
		if (response.statusCode === 200) {
			if (body.length) {
				const combined = body.map((ga) => {
					return { file: ga, ext: path.extname(ga).toLowerCase() };
				});
				res.status(200).send(combined);
			}
		} else {
			res.status(201).send(body);
			// Otherwise, send the whole response to see the result from front end
			//   res.status(response.statusCode).send(JSON.stringify(response));
		}
	});
};

export const config = {
	api: {
		externalResolver: true,
	},
};
