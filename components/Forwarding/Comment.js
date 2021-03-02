import {
  Card,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Col,
  Row,
} from "reactstrap";
import moment from "moment";
import fetch from "node-fetch";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/storage";

export const Comment = ({ comment, reference, uid }) => {
  const router = useRouter();
  const [Comment, setComment] = React.useState(false);
  const [UpdatedComment, setUpdatedComment] = React.useState([]);

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
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  async function postComment(content) {
    const data = {
      RefNo: reference,
      Content: content,
      UID: uid,
      F_Date: moment().format("l"),
      F_Show: "1",
    };
    const Fetch = await fetch("/api/forwarding/postFreightComment", {
      body: JSON.stringify(data),
      method: "POST",
    });
    if (Fetch.status === 204) {
      alert("SAVED");
      router.reload();
    } else {
      alert(`Error ${Fetch.status}`);
    }
  }

  // When the file is dropped at the Dropzone
  const onDrop = React.useCallback(async (acceptedFiles) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //Create
        const storageRef = firebase.storage().ref();
        if (acceptedFiles.length > 0) {
          acceptedFiles.map(async (data, index) => {
            const { name, lastModified, size, type } = data;
            var myfiles = storageRef.child(`forwarding/${reference}/${name}`);
            var uploadTask = myfiles.put(data);
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                var progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
              },
              (error) => {
                console.log(error);
              },
              () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  // WHEN UPLOAD IS COMPLETED, ADD THE URL TO THE COMMENT DATABASE
                  postComment(downloadURL);
                });
              }
            );
          });
        }
      } else {
        alert("PLEASE LOGIN WITH GOOGLE ACCOUNT");
      }
    });
  });
  // myfiles.put(data).then((snapshot) => {
  //   console.log("file uploaded");
  //   console.log(snapshot);
  //   console.log(snapshot.getDownloadalb)

  // });

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
  // const files = acceptedFiles.map((file) => (
  //   <a href={URL.createObjectURL(file)} key={file.path} target="__blank">
  //     <Badge className="mr-2" color="primary">
  //       <i className="fa fa-file"></i>
  //       {file.path}
  //     </Badge>
  //   </a>
  // ));

  const activeStyle = {
    borderColor: "#2196f3",
    borderStyle: "dashed",
    borderWidth: "thick",
  };

  const acceptStyle = {
    borderColor: "#00e676",
    borderStyle: "dashed",
    borderWidth: "thick",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
    borderStyle: "dashed",
    borderWidth: "thick",
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
    setUpdatedComment([]);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("yes google user");
      } else {
        console.log("no google user");
      }
    });
  }, [reference]);

  const addComment = async () => {
    if (Comment.length < 3 || Comment === false) {
      alert("Comment must be over 3 characters");
    } else {
      const data = {
        RefNo: reference,
        Content: Comment,
        UID: uid,
        F_Date: moment().format("l"),
        F_Show: "1",
      };
      const Fetch = await fetch("/api/forwarding/postFreightComment", {
        body: JSON.stringify(data),
        method: "POST",
      });
      if (Fetch.status === 204) {
        alert("SAVED");
        router.reload();
      } else {
        alert(`Error ${Fetch.status}`);
      }
    }
  };

  return (
    <Row>
      <Col className="w-100 mb-4">
        <div {...getRootProps({ style })}>
          <Card body className="shadow">
            {UpdatedComment.length > 0 ? (
              UpdatedComment.map((ga) => (
                <div
                  style={{
                    margin: ".5em 0 0",
                    border: "none",
                    lineHeight: "1.2",
                  }}
                  key={ga.F_ID}
                >
                  <div
                    className="avatar text-center"
                    style={{
                      display: "block",
                      width: "2.5em",
                      height: "2.5em",
                      float: "left",
                      backgroundColor: "#ccc",
                      borderRadius: "50%",
                    }}
                  >
                    <span
                      className="text-center"
                      style={{
                        fontSize: "1rem",
                        lineHeight: "1",
                        position: "relative",
                        top: "0.625rem",
                      }}
                    >
                      {ga.F_Name.split(" ")[0].charAt(0)}
                      {ga.F_Name.split(" ")[1].charAt(0)}
                    </span>
                  </div>
                  <div
                    className="content"
                    style={{
                      marginLeft: "4.2em",
                      marginTop: "0.2rem",
                      fontSize: "0.8em",
                    }}
                  >
                    <a
                      className="author"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {ga.F_Name}
                    </a>
                    <div
                      className="metadata"
                      style={{
                        display: "inline-block",
                        marginLeft: "0.5em",
                        color: "gray",
                      }}
                    >
                      <div>{moment(ga.F_Date).utc().calendar()}</div>
                    </div>
                    <div className="text" style={{ marginTop: "0.6em" }}>
                      {ga.F_Content}
                    </div>
                  </div>
                </div>
              ))
            ) : comment.length > 0 ? (
              comment.map((ga) => (
                <div
                  style={{
                    margin: ".5em 0 0",
                    border: "none",
                    lineHeight: "1.2",
                  }}
                  key={ga.F_ID}
                >
                  <div
                    className="avatar text-center"
                    style={{
                      display: "block",
                      width: "2.5em",
                      height: "2.5em",
                      float: "left",
                      backgroundColor: "#ccc",
                      borderRadius: "50%",
                    }}
                  >
                    <span
                      className="text-center"
                      style={{
                        fontSize: "1rem",
                        lineHeight: "1",
                        position: "relative",
                        top: "0.625rem",
                      }}
                    >
                      {ga.F_Name.split(" ")[0].charAt(0)}
                      {ga.F_Name.split(" ")[1].charAt(0)}
                    </span>
                  </div>
                  <div
                    className="content"
                    style={{
                      marginLeft: "4.2em",
                      marginTop: "0.2rem",
                      fontSize: "0.8em",
                    }}
                  >
                    <a
                      className="author"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {ga.F_Name}
                    </a>
                    <div
                      className="metadata"
                      style={{
                        display: "inline-block",
                        marginLeft: "0.5em",
                        color: "gray",
                      }}
                    >
                      <div>{moment(ga.F_Date).utc().calendar()}</div>
                    </div>
                    <div className="text" style={{ marginTop: "0.6em" }}>
                      {ga.F_Content.startsWith("https://") ? (
                        <a href={ga.F_Content} target="_blank">
                          {ga.F_Content}
                        </a>
                      ) : (
                        ga.F_Content
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-xs">
                <span>NO COMMENT</span>
              </div>
            )}

            <InputGroup className="pt-4">
              <Input
                value={Comment ? Comment : ""}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key == "Enter") addComment();
                }}
                autoFocus={false}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText className="text-xs">
                  <i className="fa fa-edit mr-1"></i>
                  <a onClick={addComment}>Add Comment</a>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Card>
        </div>
      </Col>
    </Row>
  );
};
