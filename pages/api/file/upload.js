import formidable from 'formidable'
var fs = require('fs');
const { createClient } = require("webdav");

export default async (req, res) => {
    const client = createClient(
        "http://192.168.1.3:5005",
        {
            username: "ryan",
            password: process.env.FTP_KEY,
        }
    );
    
    const form = new formidable.IncomingForm();
    // console.log("FORM DEFINED")
    form.uploadDir = './public/temp';
    form.keepExtensions=true;
    form.parse(req, async (err, fields, files) => {
        if(err) console.log(err)

        if(err || !files.file) {
            console.log("err catched")
            res.status(401).end("FALSE")
        } else {
            const exist = await client.exists(`/IT/JAMESWORLDWIDE_WEB/FORWARDING/${req.headers.path}`)
            // console.log(exist)
            if (exist) {
                fs.readFile(files.file.path, async (err,data) => {
                    await client.putFileContents(`/IT/JAMESWORLDWIDE_WEB/FORWARDING/${req.headers.path}/${files.file.name.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, "")}`, data, {
                    onUploadProgress: (progress) => {
                    console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);
                }})})

                fs.unlink(files.file.path, (err)=> {
                    if(err) {
                        console.log(err)
                    } else {
                        // FILE REMOVED
                        console.log("FILE UPLOADED")
                    }
                })
            } else {
                const create = await client.createDirectory(`/IT/JAMESWORLDWIDE_WEB/FORWARDING/${req.headers.path}`)
                if(create.status===201) {
                    fs.readFile(files.file.path, async (err,data) => {
                        await client.putFileContents(`/IT/JAMESWORLDWIDE_WEB/FORWARDING/${req.headers.path}/${files.file.name}`, data, {
                        onUploadProgress: (progress) => {
                        console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);
                    }})})
    
                    fs.unlink(files.file.path, (err)=> {
                        if(err) {
                            console.log(err)
                        } else {
                            console.log('FILE REMOVED')
                        }
                    })
                }
            }
            res.status(200).end("TRUE")
        }
    });
};
export const config = {
    api: {
      externalResolver: true,
      bodyParser: false,
    },
};