import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
// import "../public/css/fms.scss";
import "../components/css/nprogress.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-calendar/dist/Calendar.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "normalize.css/normalize.css";
import "../public/css/quill.snow.css";
import "../components/css/custom.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // DISABLED SERVICE WORKER FOR ONESIGNAL NOTIFICATION
    // if ("serviceWorker" in navigator) {
    //   // Register a service worker hosted at the root of the
    //   // site using the default scope.
    //   navigator.serviceWorker.register("/sw.js").then(
    //     function (registration) {
    //       console.log("Service worker registration succeeded:", registration);

    //       navigator.serviceWorker.addEventListener("message", (event) => {
    //         // event is a MessageEvent object
    //         console.log(`The service worker sent me a message: ${event.data}`);
    //       });

    //       // navigator.serviceWorker.ready.then((registration) => {
    //       //   registration.active.postMessage("Hi service worker");
    //       // });
    //     },
    //     /*catch*/ function (error) {
    //       console.log("Service worker registration failed:", error);
    //     }
    //   );
    // } else {
    //   console.log("Service workers are not supported.");
    // }

    const Start = () => {
      NProgress.start();
    };

    const End = (url) => {
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
