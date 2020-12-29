const {google} = require('googleapis');
const fs = require("fs");

export default async (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        '940329631468-ns1k0v3ud4inpfkj3nfmoajuf6hs5dcq.apps.googleusercontent.com',
        '9j_ysRFlEQUL-_v9B90T-DNG',
        "http://localhost:3000"
      );

    const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
      });

      async function main() {
        const res = await drive.files.create({
          requestBody: {
            name: "testimage.png",
            mimeType: "image/png",
          },
          media: {
            mimeType: "image/png",
            body: fs.createReadStream('public/image/JLOGO.png'),
          },
        });
        console.log(res.data);
      }

      main().catch(console.error);
}