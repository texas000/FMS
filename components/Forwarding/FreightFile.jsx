import { Fragment, useState } from "react";
import Select from "react-select";
import { post } from "axios";
import shipmentFileType from "../../lib/shipmentFileType";

export default function FreightFile({
  Reference,
  token,
  files,
  fileMutate,
  setMsg,
  setShow,
}) {
  const [fileTypeSelected, setFileTypeSelected] = useState({});

  function handleFileUpload(e) {
    var uploadFile = e.target.files[0];
    if (uploadFile) {
      const formData = new FormData();
      formData.append("userPhoto", uploadFile);
      try {
        const upload = new Promise((res, rej) => {
          res(
            post(`/api/file/upload?ref=${Reference}`, formData, {
              headers: {
                "content-type": "multipart/form-data",
                label: fileTypeSelected.value,
                level: fileTypeSelected.level,
              },
            })
          );
        });
        upload
          .then((ga) => {
            if (ga.status == 200) {
              setMsg(`UPLOADING FILE ${uploadFile.name}...`);
              fileMutate();
            } else {
              setMsg(ga.status);
            }
          })
          .catch((err) => {
            setMsg(JSON.stringify(err));
          });
      } catch (err) {
        if (err) {
          setMsg(JSON.stringify(err));
        }
      }
    }
    setShow(true);
  }

  async function handleFileHide(id) {
    const verify = confirm("Are you sure you want to delete this file?");
    if (verify) {
      const res = await fetch(`/api/file/hide?q=${id}`);
      if (res.ok) {
        fileMutate();
        setMsg(`File Successfully deleted!`);
        setShow(true);
      }
    }
  }

  const Files = ({ File, Level }) => {
    if (File) {
      return (
        <div>
          {File.map((ga) => {
            if (ga.F_SECURITY == Level) {
              return (
                <div key={ga.F_ID} className="flex flex-row">
                  <button
                    className="mb-2 w-100 bg-white dark:bg-gray-700 p-1 border border-gray-400 rounded-lg hover:bg-indigo-500 hover:text-white z-0"
                    onClick={async () => {
                      window.location.assign(
                        `/api/file/get?ref=${Reference}&file=${encodeURIComponent(
                          ga.F_FILENAME
                        )}`
                      );
                    }}
                  >
                    <div className="flex justify-between px-2 text-xs">
                      <span className="uppercase tracking-tight">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="inline mr-1"
                        >
                          <path
                            className="fill-current"
                            d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
                          />
                          <path
                            className="fill-current"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
                          />
                        </svg>
                        {ga.F_LABEL}
                      </span>
                      <span className="text-truncate w-1/2 text-right tracking-tight">
                        {ga.F_FILENAME}
                      </span>
                    </div>
                  </button>

                  <button
                    className="mb-2 bg-white dark:bg-gray-700 p-1 border border-gray-400 rounded-lg hover:bg-indigo-500 hover:text-white z-0 text-xs mx-1"
                    onClick={async () => {
                      const data = await fetch(
                        `/api/file/get?ref=${Reference}&file=${encodeURIComponent(
                          ga.F_FILENAME
                        )}`
                      );
                      var file = new Blob([await data.blob()], {
                        type: "application/pdf",
                      });
                      var fileURL = URL.createObjectURL(file);
                      window.open(fileURL);
                    }}
                  >
                    Open
                  </button>

                  {ga.F_UPLOADER == token.uid && (
                    <button
                      className="mb-2 bg-white dark:bg-gray-700 p-1 border border-gray-400 rounded-lg hover:bg-indigo-500 hover:text-white z-0 text-xs"
                      onClick={() => handleFileHide(ga.F_ID)}
                    >
                      Delete
                      {/* <img
                        src="https://cdn-icons-png.flaticon.com/512/126/126497.png"
                        width="20"
                        height="20"
                      /> */}
                    </button>
                  )}
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return <p>PREVENT DEFAULT</p>;
    }
  };

  return (
    <Fragment>
      <div className="card overflow-visible ">
        <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2 rounded-t-xl">
          INVOICE FILE
        </div>
        <div className="p-3 grid grid-cols-2 gap-4">
          <Select
            options={shipmentFileType(10)}
            onChange={(e) => setFileTypeSelected(e)}
            defaultValue={{ value: 0, label: "INVOICE FILE TYPE" }}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              control: (styles) => ({
                ...styles,
              }),
            }}
            className="w-100 dark:text-gray-800"
          />
          <div className="input-group">
            <input
              type="file"
              id="invoiceInput"
              className="custom-file-input"
              disabled={fileTypeSelected.level != 10}
              onChange={handleFileUpload}
            ></input>
            <label className="custom-file-label font-light">
              {fileTypeSelected.label
                ? fileTypeSelected.level == 10
                  ? fileTypeSelected.label
                  : ""
                : "Select File Type"}
            </label>
          </div>
        </div>
        <div className="px-4">
          <Files File={files} Level={10} />
        </div>
      </div>
      <div className="card overflow-visible">
        <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2 rounded-t-xl">
          CRDR FILE
        </div>
        <div className="p-3 grid grid-cols-2 gap-4">
          <Select
            options={shipmentFileType(20)}
            onChange={(e) => setFileTypeSelected(e)}
            defaultValue={{ value: 0, label: "CRDR FILE TYPE" }}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            className="w-100 dark:text-gray-800"
          />
          <div className="input-group">
            <input
              type="file"
              id="crdrInput"
              className="custom-file-input"
              disabled={fileTypeSelected.level != 20}
              onChange={handleFileUpload}
            ></input>
            <label className="custom-file-label font-light">
              {fileTypeSelected.label
                ? fileTypeSelected.level == 20
                  ? fileTypeSelected.label
                  : ""
                : "Select File Type"}
            </label>
          </div>
        </div>
        <div className="px-4">
          <Files File={files} Level={20} />
        </div>
      </div>
      <div className="card overflow-visible">
        <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2 rounded-t-xl">
          ACCOUNT PAYABLE FILE
        </div>
        <div className="p-3 grid grid-cols-2 gap-4">
          <Select
            options={shipmentFileType(30)}
            onChange={(e) => setFileTypeSelected(e)}
            defaultValue={{ value: 0, label: "AP FILE TYPE" }}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            className="w-100 dark:text-gray-800"
          />
          <div className="input-group">
            <input
              type="file"
              id="apInput"
              className="custom-file-input"
              disabled={fileTypeSelected.level != 30}
              onChange={handleFileUpload}
            ></input>
            <label className="custom-file-label font-light">
              {fileTypeSelected.label
                ? fileTypeSelected.level == 30
                  ? fileTypeSelected.label
                  : ""
                : "Select File Type"}
            </label>
          </div>
        </div>
        <div className="px-4">
          <Files File={files} Level={30} />
        </div>
      </div>
    </Fragment>
  );
}
