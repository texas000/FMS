import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect, useState } from "react";
// import "../public/css/fms.scss";
import "../components/css/nprogress.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "../components/css/custom.css";
import "react-calendar/dist/Calendar.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "normalize.css/normalize.css";
import "../public/css/quill.snow.css";

function MyApp({ Component, pageProps }) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", function () {
				navigator.serviceWorker.register("/sw.js").then(
					function (registration) {
						// console.log(
						//   "Service Worker registration successful with scope: ",
						//   registration.scope
						// );
					},
					function (err) {
						console.log("Service Worker registration failed: ", err);
					}
				);
			});
		}

		const Start = (url) => {
			// console.log(`START ${url}`)
			if (url != router.asPath) setLoading(true);
			// console.log(router.asPath, url)
			// console.log(`LOADING: ${loading}`)
			NProgress.start();
		};

		const End = (url) => {
			// console.log(`END ${url}`)
			if (url == router.asPath) setLoading(false);
			// console.log(router.asPath, url)
			// console.log(`LOADING: ${loading}`)
			NProgress.done();
		};

		router.events.on("routeChangeStart", Start);
		router.events.on("routeChangeComplete", End);
		router.events.on("routeChangeError", End);

		// If the component is unmounted, unsubscribe
		// from the event with the `off` method:
		return () => {
			router.events.off("routeChangeStart", Start);
			router.events.off("routeChangeComplete", End);
			router.events.off("routeChangeError", End);
		};
	}, []);
	return <Component {...pageProps} />;
}
export default MyApp;
