import { useDropzone } from "react-dropzone";
import axios, { post } from "axios";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import Notification from "../Toaster";

export default function CompanyFile({ id }) {
  const { data: file, mutate } = useSWR(`/api/file/list?ref=COMPANY-${id}`);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      const formData = new FormData();
      formData.append("userPhoto", file);
      try {
        await axios
          .post(`/api/file/uploadVersion2?ref=COMPANY-${id}`, formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.data.error) {
              setMsg(`ERROR: ${response.data.message}`);
              setShow(true);
            } else {
              setMsg(response.data.message);
              setShow(true);
              mutate();
              // File is successfully uploaded
            }
          })
          .catch((err) => {
            setMsg(JSON.stringify(err));
            setShow(true);
          });
      } catch (err) {
        setMsg(JSON.stringify(err));
        setShow(true);
      }
    });
  }, []);

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "50px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ onDrop });

  async function handleFileHide(id) {
    const verify = confirm("Are you sure you want to delete this file?");
    if (verify) {
      const res = await fetch(`/api/file/hide?q=${id}`);
      if (res.ok) {
        mutate();
      }
    }
  }
  return (
    <div className="card col-span-2 md:col-span-2 lg:col-span-1 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
        Files
      </div>
      <div {...getRootProps({ style })} className="cursor-pointer">
        <input {...getInputProps()} />
        <p className="m-auto">CLICK OR DROP THE FILE HERE</p>
      </div>

      <div className="shadow border-b border-gray-200 overflow-y-scroll overflow-x-hidden max-h-48">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
            {file &&
              file.map((ga, i) => (
                <tr key={`${i}-file`} className="text-gray-500">
                  <td
                    className="px-6 py-2 whitespace-nowrap hover:bg-indigo-500 hover:text-white w-3/6 cursor-pointer"
                    onClick={async () => {
                      await window.location.assign(
                        `/api/file/get?ref=COMPANY-${id}&file=${encodeURIComponent(
                          ga.F_FILENAME
                        )}`
                      );
                    }}
                  >
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
                    <span> {ga.F_FILENAME}</span>
                  </td>

                  <td className="px-6 py-2 text-center whitespace-nowrap uppercase w-1/6">
                    <select className="uppercase">
                      <option value={ga.F_LABEL}>{ga.F_LABEL}</option>
                    </select>
                  </td>
                  <td
                    className="px-6 py-2 text-center whitespace-nowrap hover:bg-indigo-500 hover:text-white w-1/6 cursor-pointer"
                    onClick={async () => {
                      const data = await fetch(
                        `/api/file/get?ref=COMPANY-${id}&file=${encodeURIComponent(
                          ga.F_FILENAME
                        )}`
                      );
                      const blob = await data.blob();
                      var file = new Blob([blob], {
                        type: blob.type,
                      });
                      var fileURL = URL.createObjectURL(file);
                      window.open(fileURL);
                    }}
                  >
                    Open
                  </td>
                  <td
                    className="px-6 py-2 text-center whitespace-nowrap hover:bg-indigo-500 hover:text-white w-1/6 cursor-pointer"
                    onClick={() => {
                      handleFileHide(ga.F_ID);
                    }}
                  >
                    Delete
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Notification show={show} msg={msg} setShow={setShow} intent="primary" />
    </div>
  );
}
