import {useDropzone} from 'react-dropzone'
import { Badge, Col, Row, Button, Alert } from "reactstrap"
import fetch from 'node-fetch'
import axios, { post } from 'axios'


export const Files = ({FilePath, FILE}) => {
    // ACCEPTED FILE FORMAT
    // PDF, IMAGE, EXCEL, DOCS, MSG
    const acceptFileType = 'image/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .msg, .pdf';

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        fontFamily: 'Roboto',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
      };
      
      const activeStyle = {
        borderColor: '#2196f3'
      };
      
      const acceptStyle = {
        borderColor: '#00e676'
      };
      
      const rejectStyle = {
        borderColor: '#ff1744'
      };
    const onDrop = React.useCallback(async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        acceptedFiles.map(async (data, index) => {
          const formData = new FormData();
      formData.append("file", acceptedFiles[index]);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          path: FilePath,
        },
      };

        const upload = new Promise((res, rej)=>res(post(`/api/file/upload`, formData, config)))
        upload.then(ga=> console.log(ga)) 
          // console.log(index)
        });
      }

      }, [])

      const {
        getRootProps,
        getInputProps,
        fileRejections,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles
      } = useDropzone({accept: acceptFileType, minSize: 0, maxSize: 10485760, onDrop});

      const files = acceptedFiles.map(file => <a href={URL.createObjectURL(file)} key={file.path} target="__blank"><Badge className="mr-2" color="primary"><i className="fa fa-file"></i>{file.path}</Badge></a>);

      const style = React.useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isDragActive,
        isDragReject,
        isDragAccept
      ]);
      
    return (
      <>
        <hr />
        <Row className="mb-4">
          <Col sm="3">
            <span className="text-info">
              <span className="fa-stack">
                <i className="fa fa-circle fa-stack-2x text-info"></i>
                <i className="fa fa-cloud fa-stack-1x fa-inverse"></i>
              </span>
              DOCS
            </span>
          </Col>
          <Col sm="9" className="pt-1">
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              <p style={{ fontFamily: "Roboto" }}>UPLOAD FILES</p>
            </div>
            {files.length > 0 && (
              <Alert className="mt-2" color="warning">
                {files.length} File Uploaded Successfully
              </Alert>
            )}
            {fileRejections.length > 0 && (
              <Alert className="mt-2" color="danger">
                {fileRejections.length} File Upload Fail <br />{" "}
                {fileRejections.map((ga) => (
                  <span key={ga.file.path}>
                    {ga.file.path} - {ga.errors[0].message}
                    <br />
                  </span>
                ))}
              </Alert>
            )}
            <aside className="mt-3">
              <ul>{files}</ul>
            </aside>
          </Col>
        </Row>
        <Row>
          <Col>
            {FILE &&
              FILE.map((ga) => (
                <Button
                  key={ga.basename}
                  size="sm"
                  target="__empty"
                  href={`${process.env.DOWNLOADABLE}${ga.filename}`}
                  className="mr-2 mb-1"
                  color="primary"
                  style={{fontFamily: 'Roboto', overflow: 'hidden', textOverflow: 'ellipsis'}}
                  outline
                >
                  <i className="fa fa-file mr-2"></i>
                  {ga.basename.length>8?ga.basename.substring(0,5)+".."+ga.basename.substring(ga.basename.length-4, ga.basename.length):ga.basename}
                </Button>
              ))}
          </Col>
        </Row>
      </>
    );}
export default Files;