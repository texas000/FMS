import { useDropzone } from "react-dropzone";
import axios, { post } from "axios";
import { BlobProvider } from "@react-pdf/renderer";
import Cover from "../Oim/Cover";
import { Button, Menu, MenuItem } from "@blueprintjs/core";
import CheckRequestForm from "../../Dashboard/CheckRequestForm";
import moment from "moment";
import { useEffect, useState } from "react";
import { Popover2 } from "@blueprintjs/popover2";

export const File = ({ Reference, House, Master, Container, Ap }) => {
  const [isClient, setIsClient] = useState(false);

  const [ApType, setApType] = useState("CHECK");
  const [files, setFiles] = useState([]);
  const ApMenu = (
    <Menu>
      <MenuItem
        icon="book"
        text="CHECK"
        onClick={() => {
          setApType("CHECK");
        }}
      />
      <MenuItem
        icon="credit-card"
        text="CARD"
        onClick={() => {
          setApType("CARD");
        }}
      />
      <MenuItem
        icon="send-to"
        text="ACH"
        onClick={() => {
          setApType("ACH");
        }}
      />
      <MenuItem
        icon="bank-account"
        text="WIRE"
        onClick={() => {
          setApType("WIRE");
        }}
      />
    </Menu>
  );

  async function getFiles() {
    const file = await fetch("/api/dashboard/getFileList", {
      method: "GET",
      headers: {
        ref: Reference,
      },
    });
    if (file.status === 200) {
      const list = await file.json();
      setFiles(list);
    } else {
      setFiles([]);
    }
  }

  useEffect(() => {
    getFiles();
    setIsClient(true);
    // getFiles().then(() => {
    //   setIsClient(true);
    // });
  }, [Reference]);

  const acceptFileType =
    "image/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .msg, application/pdf";
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    outline: "none",
    transition: "border .1s ease-in-out",
  };
  const onDrop = React.useCallback(async (acceptedFiles) => {
    acceptedFiles.map(async (data) => {
      const formData = new FormData();
      formData.append("userPhoto", data);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          reference: Reference,
        },
      };
      try {
        const upload = new Promise((res, rej) => {
          try {
            res(post(`/api/dashboard/uploadFile`, formData, config));
          } catch (err) {
            console.log(err);
            res("uploaded");
          }
        });
        upload.then((ga) => {
          if (ga.status === 200) {
            alert(`File Uploaded: ${data.name}`);
            getFiles();
            // setShow(true);
          }
        });
      } catch (err) {
        if (err.response) {
          console.log(err.response);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log(err);
        }
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
    borderColor: "blue",
    borderStyle: "dashed",
    borderWidth: "thick",
  };

  const acceptStyle = {
    borderColor: "green",
    borderStyle: "dashed",
    borderWidth: "thick",
  };

  const rejectStyle = {
    borderColor: "red",
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

  return (
    <div {...getRootProps({ style })} className="card my-4 py-4 shadow">
      <h1 className="h6 text-center my-1">
        DRAG AND DROP IS AVAILABLE TO UPLOAD FILES
      </h1>
      <div className="row px-4 py-2">
        <ul className="list-group list-group-flush col-6">
          <li className="list-group-item py-1">
            {isClient && (
              <BlobProvider
                document={
                  <Cover master={Master} house={House} containers={Container} />
                }
              >
                {({ blob, url, loading, error }) => (
                  <a href={url} target="__blank">
                    <Button
                      loading={loading}
                      disabled={!isClient}
                      text={`FOLDER COVER`}
                      icon="document"
                      intent="primary"
                      small={true}
                      style={{ fontSize: "0.7rem" }}
                    ></Button>
                  </a>
                )}
              </BlobProvider>
            )}

            <Popover2 content={ApMenu} placement="right-end">
              <Button
                icon="multi-select"
                small={true}
                style={{ fontSize: "0.7rem" }}
                className="ml-1"
                text={`AP TYPE: ${ApType}`}
              />
            </Popover2>
          </li>

          {isClient &&
            Ap.length > 0 &&
            Ap.map((ga) => (
              <li className="list-group-item py-1" key={ga.F_ID}>
                <BlobProvider
                  document={
                    <CheckRequestForm
                      check={ga.F_CheckNo}
                      type={ApType}
                      payto={ga.F_SName}
                      address={`${ga.F_Addr} ${ga.F_City} ${ga.F_State} ${ga.F_ZipCode}`}
                      irs={`${ga.F_IRSType} ${ga.F_IRSNo}`}
                      amt={Number.parseFloat(ga.F_InvoiceAmt || 0).toFixed(2)}
                      oim={Reference}
                      customer={House[0].CUSTOMER}
                      inv={ga.F_InvoiceNo}
                      metd={moment(Master.F_ETD).utc().format("MM/DD/YY")}
                      meta={moment(Master.F_ETA).utc().format("MM/DD/YY")}
                      pic={ga.F_U1ID || ""}
                      today={moment().format("l")}
                      desc={ga.F_Descript}
                      pod={Master.F_DisCharge || Master.F_Discharge}
                      comm={Master.F_mCommodity || Master.F_Commodity}
                      shipper={House[0].SHIPPER}
                      consignee={House[0].CONSIGNEE}
                    />
                  }
                >
                  {({ blob, url, loading, error }) => (
                    <a href={url} target="__blank">
                      <Button
                        icon="dollar"
                        intent="success"
                        style={{ fontSize: "0.7rem" }}
                        small={true}
                        loading={loading}
                        text={`${ga.F_SName} - $${Number.parseFloat(
                          ga.F_InvoiceAmt || 0
                        ).toFixed(2)}`}
                      ></Button>
                    </a>
                  )}
                </BlobProvider>
              </li>
            ))}
        </ul>
        <ul className="list-group list-group-flush col-6">
          {files &&
            files.map((ga) => (
              <li className="list-group-item py-1" key={ga}>
                <Button
                  className="d-block"
                  small={true}
                  icon="document"
                  onClick={async () => {
                    window.location.assign(
                      `http://jameswgroup.com:49991/api/forwarding/${Reference}/${ga}`
                    );
                  }}
                >
                  {ga}
                </Button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
export default File;
