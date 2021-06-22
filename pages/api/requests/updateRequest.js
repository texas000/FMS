const sql = require("mssql");
var request = require("request");

const SQLconfig = {
  server: process.env.JWDB_SVR,
  database: process.env.JWDB_3,
  user: process.env.JWDB_USER,
  password: process.env.JWDB_PASS,
  options: {
    appName: "test",
    encrypt: false,
    enableArithAbort: false,
    database: process.env.JWDB_2,
  },
};

function usdFormat(x) {
  var num = parseFloat(x).toFixed(2);
  if (typeof x == "number") {
    return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "$" + 0;
  }
}

export default async (req, res) => {
  const pool = new sql.ConnectionPool(SQLconfig);
  pool.on("error", (err) => {
    console.log("sql error", err);
  });
  try {
    await pool.connect();
    const body = JSON.parse(req.body);
    const reqBody = JSON.parse(body.Body);
    const ref = req.headers.ref;
    const token = JSON.parse(req.headers.token);
    const QRY = `UPDATE T_REQUEST SET Status='${body.newstatus}', Message=N'${body.message}', ModifyBy='${token.uid}', ModifyAt=GETDATE() WHERE ID='${body.ID}';`;

    var changedStatus = "Updated";
    // GENERAL
    var accounting1 = false;
    var accounting2 = false;

    // IF DIRECOTR APPROVED CASE, THEN NOTIFY TO THE ACCOUNTING, ONLY DIR CAN APPROVE THE CASE
    if (body.newstatus === 111) {
      changedStatus = "Approved";
      // ACCOUNTING - MATTHEW
      accounting1 =
        "https://hooks.slack.com/services/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";
      accounting2 =
        "https://hooks.slack.com/services/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";
    }
    // IF DIRECOTR REJECT CASE, THEN NOTIFY TO THE OPERATOR, ONLY DIR CAN REJECT THE CASE
    if (body.newstatus === 110) {
      changedStatus = "Rejected";
    }
    // IF ACCOUNTING APPROVED OR REJECT THE CASE, THEN NOTIFY TO THE OPERATOR, ONLY ACC CAN APPROVE THE CASE
    if (body.newstatus === 120) {
      changedStatus = "Rejected";
    }
    // IF DIRECOTR REJECT CASE, THEN NOTIFY TO THE OPERATOR, ONLY DIR CAN REJECT THE CASE
    if (body.newstatus === 121) {
      changedStatus = "Approved";
      accounting1 =
        "https://hooks.slack.com/services/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";
      accounting2 =
        "https://hooks.slack.com/services/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";
    }

    var options = {
      method: "POST",
      // TO GENERAL SLACK
      uri: "https://hooks.slack.com/services/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",
      headers: {
        "content-type": "application/json",
      },
      body: {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*[${token.first}] ${changedStatus} AP Request*\n\n<https://jwiusa.com${reqBody.path}|View request> OR MESSAGE TO <@${body.SlackId}>`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${body.message}*`,
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
      text: reqBody.file,
      type: "button",
      url: `http://jameswgroup.com:49991/api/forwarding/${ref}/${encodeURIComponent(
        reqBody.file
      )}`,
    });

    if (reqBody.file2 != false) {
      options.body.attachments[0].actions.push({
        name: "supporting",
        text: reqBody.file2,
        type: "button",
        url: `http://jameswgroup.com:49991/api/forwarding/${ref}/${encodeURIComponent(
          reqBody.file2
        )}`,
      });
    }

    let result = await pool.request().query(QRY);

    if (result.rowsAffected[0]) {
      res.status(200).end(JSON.stringify(result));

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if (response.statusCode === 200) {
          console.log(body);
        } else {
          console.log(response);
        }
      });

      if (accounting1) {
        options.uri = accounting1;
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          if (response.statusCode === 200) {
            console.log(body);
          } else {
            console.log(response);
          }
        });
      }
      if (accounting2) {
        options.uri = accounting2;
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          if (response.statusCode === 200) {
            console.log(body);
          } else {
            console.log(response);
          }
        });
      }
    } else {
      res.status(200).end([]);
    }
  } catch (err) {
    res.status(202).end(JSON.stringify(err));
    return { err: err };
  } finally {
    return pool.close();
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
