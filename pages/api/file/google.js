const {google} = require('googleapis');
const fs = require("fs");

const oauth2Client = new google.auth.OAuth2(
    '940329631468-ns1k0v3ud4inpfkj3nfmoajuf6hs5dcq.apps.googleusercontent.com',
    '9j_ysRFlEQUL-_v9B90T-DNG',
    "http://localhost:3000"
  );
  const scopes = [
    'https://www.googleapis.com/auth/drive',
  ];
  export default async (req, res) => {
      const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
      
        // If you only need one scope you can pass it as a string
        scope: scopes
      });

      
      res.status(200).json({login: url})
  }
