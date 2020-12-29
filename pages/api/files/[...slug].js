const { createClient } = require("webdav");
const stream = require('stream');
const fs = require('fs')
const request = require('request')
const fetch = require('node-fetch')

export default async (req, res) => {
    const {
        query: { slug },
      } = req
    
    const BASE_PATH = '/IT/JAMESWORLDWIDE_WEB/'

    //Folder Path Inside the Folder (IT/JAMESWORLDWIDE_WEB)
    const Path = slug.join('/')

    const client = createClient(
        "http://192.168.1.3:5005",
        {
            username: "ryan",
            password: process.env.FTP_KEY,
        }
    );

    //UPLOAD
    //CHECK IF THE QUERY PATH EXIST
    // IF EXSIT, GET THE UPLOADABLE LINK
    // IF NOT, CREATE THE FOLDER AND GET THE UPLOADABLE LINK

    try {
        //DOWNLOAD
        //CHECK IF THE QUERY PATH EXIST
        if (await client.exists(`${BASE_PATH}${Path}`)) {
          // IF EXIST, THEN GET THE ALL DOWNLOADABLE LINK FROM THE FOLDER
          const dirItems = await client.getDirectoryContents(
            `${BASE_PATH}${Path}`
          );
          // console.log(dirItems);
          var files = [];
          if (dirItems.length > 0) {
            dirItems.map((ga) => {
              files.push(ga);
            });
          }

          // *** GET DOWNLOADABLE LINK
            // const downloadable = await client.getFileDownloadLink(
            //   `${files[0].filename}`
            // );
          // *** GET DOWNLOADABLE LINK

          const uploadable = await client.getFileUploadLink(
            `${BASE_PATH}${Path}`
          );
          // SHOW UPLOADBLE FOLER
          // console.log(uploadable)

          // SEND FILES IN THE PATH
          res.status(200).json(files);
        } else {
            // IF NOT, THROW AN ERROR TO DISPLAY THE ERROR
            // console.log(`${Path} NOT EXIST`)
            
            res.status(400).end(false);
        }
        //GET FILES FROM THE PATH (BASE PATH + QUERY PATH)
        // const getItems = await client.getFileContents(`/IT/JAMESWORLDWIDE_WEB/${Path}`);
        // RETURN THE BUFFER TYPE
        
        // GET FILE AS BUFFER TYPE
        
        // const files = getItems
        // console.log(files)

        // WRITE FILE AT THE PUBLIC FOLDER
        // fs.writeFile('./public/sample.pdf', files, function (err) {
        //     if (err) return console.log(err);
        //     console.log('pdf saved');
        //   });
        
        
        
        //TEST
        // const buffer = new Buffer.from(req.body)
        
        // console.log(buffer)
        // //   Upload a file and log the progress to the console:
        // fs.createWriteStream("FILE.png").write(buffer)
        
        // await client.putFileContents("/IT/JAMESWORLDWIDE_WEB/sample.png", buffer, {
        //     onUploadProgress: (progress) => {
        //         console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);
        //     },
        // }); 
        // res.status(200).end("done")

        //DOWNLOADABLE LINK
        // const downloadable = await client.getFileDownloadLink(`/IT/JAMESWORLDWIDE_WEB/${Path}`);

        //SEND TO THE SCREEN
        // res.json(downloadable)
        
    } catch (err) {
        console.log("ERROR CATCHED")
        // [KEEP] DETAIL ERROR RESPONSE
        res.end(`<h1>${err.message}</h1>`)
        // res.status(err.response.status).end(err.response.statusText)
    }
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
      

// Get directory contents
    
    // console.log(client)
    // {
    //     copyFile: [Function: copyFile],
    //     createDirectory: [Function: createDirectory],
    //     createReadStream: [Function: createReadStream],
    //     createWriteStream: [Function: createWriteStream],
    //     customRequest: [Function: customRequest],
    //     deleteFile: [Function: deleteFile],
    //     exists: [Function: exists],
    //     getDirectoryContents: [Function: getDirectoryContents],
    //     getFileContents: [Function: getFileContents],
    //     getFileDownloadLink: [Function: getFileDownloadLink],
    //     getFileUploadLink: [Function: getFileUploadLink],
    //     getQuota: [Function: getQuota],
    //     moveFile: [Function: moveFile],
    //     putFileContents: [Function: putFileContents],
    //     stat: [Function: stat]
    //   }