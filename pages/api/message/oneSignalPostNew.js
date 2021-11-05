var request = require("request");

export default async (req, res) => {
  var sendNotification = function (data) {
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Basic ${process.env.ONESIGNALKEY}`,
    };

    var options = {
      uri: "https://onesignal.com/api/v1/notifications",
      port: 443,
      //   path: "/api/v1/notifications",
      method: "POST",
      headers: headers,
      body: data,
      json: true,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      // IF RESPONSE IS 200, SEND THE BODY WITH 200 STATUS CODE
      if (response.statusCode === 200) {
        res.status(200).send(body);
      } else {
        // console.log(response);
        // Otherwise, send the whole response to see the result from front end
        res.status(response.statusCode).send(JSON.stringify(response));
      }
    });
  };

  var message = {
    app_id: "4db5fd76-1074-4e1c-ad4b-9c365fea2cf6",
    contents: { en: req.body },
    name: "Announcement",
    headings: { en: "Announcement" },
    included_segments: ["Subscribed Users"],
  };

  sendNotification(message);
};

// export default async (req, res) => {
//   var texts = {
//     text: `${req.body.text}`,
//   };
//   // Define Request Options, *** USE ENV VALUE FOR BASE URI ***
// //   var options = {
// //     method: "POST",
// //     uri: process.env.SLACK_IT,
// //     headers: {
// //       "content-type": "application/json",
// //     },
// //     body: texts,
// //     json: true,
// //   };

//   request(options, function (error, response, body) {
//     // IF ERROR, THROW ERROR
//     if (error) throw new Error(error);
//     // IF RESPONSE IS 200, SEND THE BODY WITH 200 STATUS CODE
//     if (response.statusCode === 200) {
//       res.status(200).send(body);
//     } else {
//       // Otherwise, send the whole response to see the result from front end
//       res.status(response.statusCode).send(JSON.stringify(response));
//     }
//   });
// };

export const config = {
  api: {
    externalResolver: true,
  },
};
