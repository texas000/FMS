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

export default async (req, res) => {
  const pool = new sql.ConnectionPool(SQLconfig);
  pool.on("error", (err) => {
    console.log("sql error", err);
  });
  try {
    await pool.connect();
    const body = JSON.parse(req.body);
    const ref = req.headers.ref;
    const token = JSON.parse(req.headers.token);

    const QRY = `INSERT INTO T_REQUEST (RefNo, Status, Title, Body, CreateAt, ModifyAt, CreateBy, ModifyBy, TBName, TBID, Attachment, ApType, Attachment2) VALUES ('${ref}','101','AP REQUEST FOR ${
      body.F_InvoiceNo
    }','${JSON.stringify(body)}',GETDATE(),GETDATE(),'${token.uid}','${
      token.uid
    }','T_APHD','${body.F_ID}', '${body.file}', '${body.type}', ${
      body.file2 == false ? "NULL" : `'${body.file2}'`
    });`;
    // console.log(body);

    function usdFormat(x) {
      var num = parseFloat(x).toFixed(2);
      if (typeof x == "number") {
        return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return "$" + 0;
      }
    }

    var options = {
      method: "POST",
      uri: "https://hooks.slack.com/services/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",
      // IAN - https://hooks.slack.com/services/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
      // uri: process.env.SLACK_IT,
      headers: {
        "content-type": "application/json",
      },
      body: {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*[${token.first}] Requested AP Approval*\n\n<https://jwiusa.com${body.path}|View request> OR MESSAGE TO <@${body.SlackId}>`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Type:*\n${body.type}`,
              },
              {
                type: "mrkdwn",
                text: `*Amount:*\n${usdFormat(body.F_InvoiceAmt)}`,
              },
              {
                type: "mrkdwn",
                text: `*Invoice:*\n${body.F_InvoiceNo}`,
              },
              {
                type: "mrkdwn",
                text: `*Pay To:*\n${body.F_SName}`,
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
      text: body.file,
      type: "button",
      url: `http://jameswgroup.com:49991/api/forwarding/${ref}/${encodeURIComponent(
        body.file
      )}`,
    });

    if (body.file2 != false) {
      options.body.attachments[0].actions.push({
        name: "supporting",
        text: body.file2,
        type: "button",
        url: `http://jameswgroup.com:49991/api/forwarding/${ref}/${encodeURIComponent(
          body.file2
        )}`,
      });
    }

    let result = await pool.request().query(QRY);
    // console.log(result);
    if (result.rowsAffected[0]) {
      // console.log(result);
      res.status(200).end(JSON.stringify(result));
      try {
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          if (response.statusCode === 200) {
            console.log(body);
          } else {
            console.log(response);
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.status(200).end([]);
    }
  } catch (err) {
    console.log(err);
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
