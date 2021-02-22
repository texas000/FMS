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

export const Comment = ({ comment, reference, uid }) => {
  const [Comment, setComment] = React.useState(false);
  const [UpdatedComment, setUpdatedComment] = React.useState([]);

  React.useEffect(() => {
    setUpdatedComment([]);
  }, [reference]);

  const addComment = async () => {
    const value = `INSERT INTO T_FREIGHT_COMMENT (F_RefNo, F_Content, F_UID, F_Date, F_Show) VALUES('${reference}', N'${Comment.replace(
      /\'/g,
      "''"
    )}', '${uid}', GETDATE(), '1');
      SELECT (SELECT F_FNAME+' '+F_LNAME FROM T_MEMBER WHERE T_MEMBER.F_ID=T_FREIGHT_COMMENT.F_UID) as F_Name, * FROM T_FREIGHT_COMMENT WHERE F_RefNo='${reference}';`;
    if (Comment.length < 3 || Comment === false) {
      alert("Comment must be over 3 characters");
    } else {
      if (Comment.length > 1000) {
        alert("Comment must be less than 1000 characters");
      } else {
        const Fetch = await fetch("/api/forwarding/updateExtra", {
          body: value,
          method: "POST",
        }).then((t) => t.json());
        setUpdatedComment(Fetch);
        console.log(Fetch);
        setComment(false);
      }
    }
  };

  return (
    <Row>
      <Col className="w-100 mb-4">
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
                    {ga.F_Content}
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
      </Col>
    </Row>
  );
};
