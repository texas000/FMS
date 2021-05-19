import moment from "moment";

export const CommentList = ({ first, last, content, uid, date }) => {
  return (
    <div className="media my-1">
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
          {first.charAt(0)}
          {last.charAt(0)}
        </span>
      </div>
      <div className="content media-body text-xs">
        <div className="metadata">
          <span className="text-gray-900 text-uppercase">
            {first} {last}{" "}
          </span>
          <span className="ml-2 text-gray-500">{moment(date).fromNow()}</span>
          <span>
            {uid && (
              <i
                className="fa fa-times ml-2 text-danger"
                // onClick={() => deleteComment(ga.ID)}
              ></i>
            )}
          </span>
        </div>
        <span className="text-gray-800">
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
          {/* {content} */}
          {/* {ga.Link == null || ga.Link == "" ? (
            ga.Content
          ) : (
            <a href={ga.Link} target="_blank">
              {ga.Content}
            </a>
          )} */}
        </span>
      </div>
    </div>
  );
};
export default CommentList;
