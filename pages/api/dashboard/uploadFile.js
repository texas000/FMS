var request = require("request");
var formidable = require("formidable");
var fs = require("fs");
var axios,
  { post } = require("axios");
const { createClient } = require("webdav");

export default async (req, res) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  const upload = new Promise((res, rej) =>
    res(post(`http://jameswgroup.com:49991/api/photo`, req.body, config))
  );
  upload.then((ga) => res.end(ga));

  // if (err || !files.file) {
  //   console.log("err catched");
  //   res.status(401).end("FALSE");
  // } else {
  //   const exist = await client.exists(`/JWI/FORWARDING/test`);
  //   // console.log(exist)
  //   if (exist) {
  //     fs.readFile(files.file.path, async (err, data) => {
  //       await client.putFileContents(`/JWI/FORWARDING/test`, data, {
  //         onUploadProgress: (progress) => {
  //           console.log(
  //             `Uploaded ${progress.loaded} bytes of ${progress.total}`
  //           );
  //         },
  //       });
  //     });

  //     fs.unlink(files.file.path, (err) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         // FILE REMOVED
  //         console.log("FILE UPLOADED");
  //       }
  //     });
  //   } else {
  //     const create = await client.createDirectory(`/JWI/FORWARDING/test`);
  //     if (create.status === 201) {
  //       fs.readFile(files.file.path, async (err, data) => {
  //         await client.putFileContents(`/JWI/FORWARDING/test`, data, {
  //           onUploadProgress: (progress) => {
  //             console.log(
  //               `Uploaded ${progress.loaded} bytes of ${progress.total}`
  //             );
  //           },
  //         });
  //       });

  //       fs.unlink(files.file.path, (err) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           console.log("FILE REMOVED");
  //         }
  //       });
  //     }
  //   }
  //   res.status(200).end("TRUE");
  // }
  //     var dir = './public/temp';
  //     if(!fs.existsSync(dir)) {
  //         fs.mkdirSync(dir);
  //     }
  //     const form = new formidable.IncomingForm();

  //     form.uploadDir = './public/temp';
  //     form.keepExtensions=true;
  //     form.parse(req, async (err, fields, files) => {
  //         if(err) console.log(err)
  //     })

  //   var url = "http://jameswgroup.com:49991/api/photo";
  //   var options = {
  //     headers: {
  //       "cache-control": "no-cache",
  //       "content-type": req.headers["content-type"],
  //     },
  //   };
  //   //   console.log(req.headers["content-type"]);
  //   var result = axios.post(url, req.body.file, options);
  //   res.send(await result);
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
