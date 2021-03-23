import {
  Card,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import moment from "moment";
import fetch from "node-fetch";
import { useDropzone } from "react-dropzone";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/storage";
import { Tag, Toast, Toaster } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";

export const Comment = ({ reference, uid, main }) => {
  const [Comment, setComment] = React.useState(false);
  const [UpdatedComment, setUpdatedComment] = React.useState([]);
  const [Uploading, setUploading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [msgType, setMsgType] = React.useState("success");

  const FormsToaster = () => {
    if (show) {
      return (
        <Toaster position="top">
          <Toast
            message={msg}
            intent={msgType}
            onDismiss={() => setShow(false)}
          ></Toast>
        </Toaster>
      );
    } else {
      return <React.Fragment></React.Fragment>;
    }
  };
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
  // ONLY WORKS WHEN THE FILE IS UPLOADE
  async function postComment(content, link) {
    const data = {
      RefNo: reference,
      Content: content,
      Link: link,
      UID: uid,
    };
    const fetchPostComment = await fetch("/api/forwarding/postFreightComment", {
      body: JSON.stringify(data),
      method: "POST",
    });

    if (fetchPostComment.status === 200) {
      const newMsg = await fetchPostComment.json();
      setUpdatedComment((prev) => [...prev, newMsg[0]]);
    } else {
      alert(`Error ${Fetch.status}`);
    }
  }

  // When the file is dropped at the Dropzone
  const onDrop = React.useCallback(async (acceptedFiles) => {
    // UPLOADING FILE IS WORKING ONLY IF USER IS LOGGED IN WITH FIREBASE
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // CREATE FIREBASE STORAGE REFERENCE
        const storageRef = firebase.storage().ref();
        if (acceptedFiles.length > 0) {
          //IF THERE ARE MULTIPLE FILES, ITERATE TO UPLOAD FILES
          acceptedFiles.map(async (data) => {
            // GET THE NAME FROM FILE
            const { name, lastModified, size, type } = data;

            // DEFINE THE PATH FORWARDING/REFERENCE/FILE NAME
            var myfiles = storageRef.child(`forwarding/${reference}/${name}`);

            // DEFINE THE UPLOAD TASK WITH CORRECT FILES
            var uploadTask = myfiles.put(data);

            // WHEN THE UPLOADING TASK IS ON
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                var progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //SET UPLOAD PROGRESS SO TAHT SPINNER CAN BE DISPLAYED
                setUploading(progress);
              },
              (error) => {
                console.log(error);
              },
              () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  // WHEN UPLOAD IS COMPLETED, ADD THE URL TO THE COMMENT DATABASE
                  postComment(name, downloadURL);
                  // WHEN UPLOAD IS COMPLETED, SET UPLOADING AS FALSE TO DISABLE SPINNER
                  setUploading(false);
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

  async function getComment() {
    const fetchGetComment = await fetch("/api/forwarding/getFreightComment", {
      headers: { ref: reference },
    });
    if (fetchGetComment.status === 200) {
      const Comments = await fetchGetComment.json();
      setUpdatedComment([
        {
          ID: "CREATED",
          UID_FNAME: main.U1ID,
          UID: 999,
          Content: `${main.U1ID.toUpperCase()} CREATED ${reference} AT FREIGHT STREAM`,
          Date: main.U1Date,
          Show: "1",
        },
        {
          ID: "CHANGED",
          UID_FNAME: main.U2ID,
          UID: 999,
          Content: `${main.U2ID.toUpperCase()} CHANGED ${reference} AT FREIGHT STREAM`,
          Date: main.U2Date,
          Show: "1",
        },
        {
          ID: "CLOSED",
          UID_FNAME: "SYSTEM",
          UID: 999,
          Content: `${reference} CASE CLOSED`,
          Date: main.U2Date,
          Show: main.FileClosed === "3" && "1",
        },
        ...Comments,
      ]);
      // setUpdatedComment(Comments);
    } else {
      setUpdatedComment([
        {
          ID: "CREATED",
          UID_FNAME: main.U1ID,
          UID: 999,
          Content: `${main.U1ID.toUpperCase()} CREATED ${reference} AT FREIGHT STREAM`,
          Date: main.U1Date,
          Show: "1",
        },
        {
          ID: "CHANGED",
          UID_FNAME: main.U2ID,
          UID: 999,
          Content: `${main.U2ID.toUpperCase()} CHANGED ${reference} AT FREIGHT STREAM`,
          Date: main.U2Date,
          Show: "1",
        },
        {
          ID: "CLOSED",
          UID_FNAME: "SYSTEM",
          UID: 999,
          Content: `${reference} CASE CLOSED`,
          Date: main.U2Date,
          Show: main.FileClosed === "3" && "1",
        },
      ]);
    }
  }

  async function deleteComment(ID) {
    deleteComment;
    const check = confirm("DELETE?");
    if (check) {
      const fetchDeleteComment = await fetch(
        "/api/forwarding/deleteFreightComment",
        {
          headers: { ref: ID },
          method: "PUT",
          body: JSON.stringify({
            show: "0",
          }),
        }
      );
      if (fetchDeleteComment.status === 200) {
        // GET THE INDEX OF SELECTED ARRAY
        const index = UpdatedComment.findIndex((element) => element.ID == ID);
        var items = UpdatedComment;
        // CHANGE THE VALUE OF SHOW
        items[index].Show = "0";
        // SET THE STATE
        setUpdatedComment(items);
      } else {
        console.log(fetchDeleteComment.status);
      }
    }
  }

  React.useEffect(() => {
    getComment();
  }, [reference]);

  const addComment = async () => {
    if (Comment.length < 3 || Comment === false) {
      alert("Comment must be over 3 characters");
    } else {
      setComment("");
      const data = {
        RefNo: reference,
        Content: Comment,
        UID: uid,
        Link: null,
      };
      console.log(data);
      const Fetch = await fetch("/api/forwarding/postFreightComment", {
        body: JSON.stringify(data),
        method: "POST",
      });
      if (Fetch.status === 200) {
        const NewComment = await Fetch.json();
        setUpdatedComment((prev) => [...prev, NewComment[0]]);
        setMsg(`Message Saved: ${NewComment[0].Content}`);
        setShow(true);
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
            {Uploading != false && Uploading > 0 && (
              <div className="text-center text-primary">
                <Spinner color="primary" />
                {`Uploading is in progress... ${Uploading}%`}
              </div>
            )}
            {UpdatedComment.map(
              (ga) =>
                ga.Show == "1" && (
                  <div key={ga.ID} className="media my-1">
                    <div
                      className="avatar text-xs mr-3 text-uppercase"
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        width: "35px",
                        height: "35px",
                        position: "relative",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        color: "#FFF",
                        borderRadius: "50%",
                      }}
                    >
                      <span
                        className="text-center"
                        style={{
                          left: "50%",
                          top: "50%",
                          position: "absolute",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {ga.UID_FNAME.charAt(0)}
                        {ga.UID_LNAME && ga.UID_LNAME.charAt(0)}
                      </span>
                    </div>
                    <div className="content media-body text-xs">
                      <div className="metadata">
                        <span className="text-gray-800 text-uppercase">
                          {ga.UID_FNAME} {ga.UID_LNAME}{" "}
                        </span>
                        <span>{moment(ga.Date).format("LLL")}</span>
                        <span>
                          {ga.UID === uid && (
                            <i
                              className="fa fa-times ml-2 text-danger"
                              onClick={() => deleteComment(ga.ID)}
                            ></i>
                          )}
                        </span>
                      </div>
                      <span className="text-gray-800">
                        {ga.Link == null || ga.Link == "" ? (
                          ga.Content
                        ) : (
                          <a href={ga.Link} target="_blank">
                            {ga.Content}
                          </a>
                        )}
                      </span>
                    </div>
                  </div>
                )
            )}
            <div className="bp3-input-group mt-2">
              <input
                type="text"
                className="bp3-input"
                placeholder="Type comment here..."
                value={Comment ? Comment : ""}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key == "Enter") addComment();
                }}
                autoFocus={false}
              />
              <button
                className="bp3-button bp3-icon-edit"
                style={{ fontSize: "0.7rem" }}
                onClick={addComment}
              >
                Add Comment
              </button>
            </div>
          </Card>
        </div>
        <FormsToaster />
      </Col>
    </Row>
  );
};
