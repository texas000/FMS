var request = require("request");

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const reqBody = JSON.parse(body.Body);
  function usdFormat(x) {
    var num = parseFloat(x).toFixed(2);
    if (typeof x == "number") {
      return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "$" + 0;
    }
  }
  const token = JSON.parse(req.headers.token);

  var options = {
    method: "POST",
    uri: "",
    headers: {
      "content-type": "application/json",
    },
    body: {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*[${token.first}] Want you to remind AP Request*\n\n<https://jwiusa.com${reqBody.path}|View request> OR MESSAGE TO <@${body.SlackId}>`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${body.Message}*`,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Type:*\n${reqBody.type}`,
            },
            {
              type: "mrkdwn",
              text: `*Amount:*\n${usdFormat(reqBody.F_InvoiceAmt)}`,
            },
            {
              type: "mrkdwn",
              text: `*Invoice:*\n${reqBody.F_InvoiceNo}`,
            },
            {
              type: "mrkdwn",
              text: `*Pay To:*\n${reqBody.F_SName}`,
            },
          ],
        },
      ],
      attachments: [
        {
          title: "Download Files",
          color: "#3AA3E3",
          attachment_type: "default",
          actions: [],
        },
      ],
    },
    json: true,
  };

  options.body.attachments[0].actions.push({
    name: "main",
    text: body.Attachment,
    type: "button",
    url: `http://jameswgroup.com:49991/api/forwarding/${
      body.RefNo
    }/${encodeURIComponent(body.Attachment)}`,
  });

  if (reqBody.file2 != false) {
    options.body.attachments[0].actions.push({
      name: "supporting",
      text: body.Attachment2,
      type: "button",
      url: `http://jameswgroup.com:49991/api/forwarding/${
        body.RefNo
      }/${encodeURIComponent(body.Attachment)}`,
    });
  }

  if (body.Status == 101) {
    //IAN
    options.uri = process.env.SLACK_IAN;
  }
  if (body.Status == 111) {
    //MATTHEW
    options.uri = process.env.SLACK_MATT;
  }

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (response.statusCode === 200) {
      res.status(200).send(body);
    } else {
      res.status(response.statusCode).send(JSON.stringify(response));
    }
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
