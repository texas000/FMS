import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";

import { useDropzone } from "react-dropzone";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/storage";
import { Alert, Badge } from "reactstrap";

export default function blank({ Cookie }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  const firebaseConfig = {
    apiKey: "AIzaSyBWvOh5KL16jU-rD2mYt-OY7hIhnCMBZ60",
    authDomain: "jw-web-ffaea.firebaseapp.com",
    databaseURL: "https://jw-web-ffaea.firebaseio.com",
    projectId: "jw-web-ffaea",
    storageBucket: "jw-web-ffaea.appspot.com",
    messagingSenderId: "579008207978",
    appId: "1:579008207978:web:313c48437e50d7e5637e13",
    measurementId: "G-GPMS588XP2",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  // Define acceptable file type
  const acceptFileType =
    "image/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .msg, .pdf";
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };
  // When the file is dropped at the Dropzone
  const onDrop = React.useCallback(async (acceptedFiles) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //Create
        const storageRef = firebase.storage().ref();
        if (acceptedFiles.length > 0) {
          acceptedFiles.map(async (data, index) => {
            const { name, lastModified, size, type } = data;

            var myfiles = storageRef.child(`docs/${name}`);
            myfiles.put(data).then((snapshot) => {
              console.log("file uploaded");
              console.log(snapshot);
            });

            // const formData = new FormData();
            // formData.append("file", acceptedFiles[index]);
            // console.log(formData);
            // const config = {
            //   headers: {
            //     "content-type": "multipart/form-data",
            //     path: FilePath,
            //   },
            // };

            // const upload = new Promise((res, rej)=>res(post(`/api/file/upload`, formData, config)))
            // upload.then(ga=> console.log(ga))
            // console.log(index)
          });
        }
      } else {
        alert("PLEASE LOGIN WITH GOOGLE ACCOUNT");
      }
    });
  });

  // Define the functions from Dropzone package
  const {
    getRootProps,
    getInputProps,
    fileRejections,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: acceptFileType,
    minSize: 0,
    maxSize: 10485760,
    onDrop,
  });

  // Display the files that have been uploaded to the Dropzone
  const files = acceptedFiles.map((file) => (
    <a href={URL.createObjectURL(file)} key={file.path} target="__blank">
      <Badge className="mr-2" color="primary">
        <i className="fa fa-file"></i>
        {file.path}
      </Badge>
    </a>
  ));

  const activeStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  // Custom styles when the file is changed
  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var storage = firebase.storage().ref("docs");
        storage.listAll().then((res) => {
          res.items.forEach((itemRef) => {
            itemRef.getDownloadURL().then((ga) => console.log(ga));
          });
        });
      } else {
        console.log("no google user");
      }
    });
  }, []);

  return (
    <Layout TOKEN={TOKEN} TITLE="Blank">
      <h3>Blank Page</h3>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <h2>UPLOAD FILES</h2>
      </div>
      {files.length > 0 && (
        <Alert className="mt-2" color="warning">
          {files.length} File Uploaded Successfully
        </Alert>
      )}
      <aside className="mt-3">
        <ul>{files}</ul>
      </aside>
      {/* <Input type="file" onChange={(e) => uploadFiles(e)} /> */}
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  // Pass data to the page via props
  return { props: { Cookie: cookies } };
}
