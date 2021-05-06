import { FileInput } from "@blueprintjs/core";
import readXlsxFile from "read-excel-file";
import React from "react";

export const AmazonUpload = () => {
  const [xlsx, setXlsx] = React.useState([]);

  function handleUpload(e) {
    e.preventDefault();
    var f = e.target.files[0];
    // Only allowed file format is xslx
    if (
      f.type ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Read file and update the amazon xlsx file to database
      readXlsxFile(f).then(async (row) => {
        setXlsx(row);
        const postExcel = await fetch(`/api/file/amazonExcel`, {
          method: "POST",
          body: JSON.stringify(row),
        });
        if (postExcel.status === 200) {
          const result = await postExcel.json();
          setXlsx(result);
        } else {
          alert("UPLOAD FAILED");
        }
      });
    } else {
      // If the file is not xlsx throw an error message
      alert(`${f.type} is not supported`);
    }
  }

  return (
    <div className="row my-4">
      <div className="col">
        <div className="card">
          <div className="card-header text-primary font-weight-bold">
            IMPORT AMAZON FILE
          </div>
          <div className="card-body">
            <FileInput
              text="Choose Excel File..."
              onInputChange={handleUpload}
            />
            {xlsx && xlsx.length > 0 && (
              <h2 className="text-success">{xlsx.length} ROWS UPLOADED</h2>
            )}
            {xlsx.map((ga, i) => {
              return <p key={i}>{`Settlement ID: ${ga.SettlementID}`}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AmazonUpload;
