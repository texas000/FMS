import { useRouter } from "next/router";
import Link from "next/link";

export default function NavSearch({ setValue }) {
  const router = useRouter();
  var pageHistory = "[]";
  var history = "[]";
  if (typeof window !== "undefined") {
    // If the local storage has history before, assign the history.
    // Otherwise, set the empty array as a string
    history = localStorage.getItem("searchHistory") || "[]";
    pageHistory = localStorage.getItem("pageHistory") || "[]";
  }
  function handleSearch(e) {
    e.preventDefault();
    var arr = [];
    // If history has array meaning this is not first time search
    if (history != "[]") {
      arr = JSON.parse(history);
    }
    // Add the new search value to the array
    // Then assign the following array to local storage
    arr.unshift(e.target[0].value);
    localStorage.setItem("searchHistory", JSON.stringify(arr));
    router.push(`/search?q=${e.target[0].value}`);
    document.activeElement.blur();
    setValue(false);
  }
  return (
    <div
      id="search-modal"
      className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center transform px-4 sm:px-6 exit-done"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setValue(false);
        }
      }}
    >
      <div className="bg-white overflow-auto max-w-2xl w-full max-h-full rounded shadow-lg">
        <form className="border-b border-gray-200" onSubmit={handleSearch}>
          <div className="relative">
            <label htmlFor="modal-search" className="sr-only">
              Search
            </label>
            <input
              id="modal-search"
              className="w-full border-0 focus:ring-transparent placeholder-gray-400 appearance-none py-3 pl-10 pr-4 text-gray-700 focus:outline-none"
              autoFocus={true}
              autoCorrect="off"
              autoComplete="off"
              type="search"
              placeholder="Search Anything…"
            />
            <button
              className="absolute inset-0 right-auto group"
              type="submit"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 flex-shrink-0 fill-current text-gray-400 group-hover:text-gray-500 mx-3"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"></path>
                <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"></path>
              </svg>
            </button>
          </div>
        </form>
        <div className="py-4 px-2">
          <div className="mb-3 last:mb-0">
            <div className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">
              Recent searches
            </div>
            <ul className="text-sm">
              {JSON.parse(history).map((ga, i) => {
                if (i < 5) {
                  return (
                    <li key={i + "RS"}>
                      <Link href={`/search?q=${encodeURIComponent(ga)}`}>
                        <a
                          className="flex items-center p-2 text-gray-800 hover:text-white hover:bg-indigo-500 rounded group"
                          onClick={() => setValue(false)}
                          style={{ textDecoration: "none" }}
                        >
                          <svg
                            className="w-4 h-4 fill-current text-gray-400 group-hover:text-white group-hover:text-opacity-50 flex-shrink-0 mr-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z"></path>
                          </svg>
                          <span>{ga}</span>
                        </a>
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
          <div className="mb-3 last:mb-0">
            <div className="text-xs font-semibold text-gray-400 uppercase px-2 mb-2">
              Recent pages
            </div>
            <ul className="text-sm">
              {JSON.parse(pageHistory).map((ga, i) => {
                if (i < 10) {
                  return (
                    <li key={i + "PH"}>
                      <Link href={ga.path}>
                        <a
                          className="flex items-center p-2 text-gray-800 hover:text-white hover:bg-indigo-500 rounded group"
                          onClick={() => setValue(false)}
                          style={{ textDecoration: "none" }}
                        >
                          <svg
                            className="w-4 h-4 fill-current text-gray-400 group-hover:text-white group-hover:text-opacity-50 flex-shrink-0 mr-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z"></path>
                          </svg>
                          <span>
                            <span className="font-medium text-gray-800 group-hover:text-white">
                              {ga.ref}
                            </span>{" "}
                            <span className="text-gray-400">{ga.path}</span>
                          </span>
                        </a>
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
