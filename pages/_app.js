import {useRouter, withRouter} from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import '../components/css/nprogress.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-calendar/dist/Calendar.css';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    
    useEffect(() => {
        const Start = (url) => {
            // console.log(`START ${url}`)
            if(url != router.asPath) setLoading(true);
            // console.log(router.asPath, url)
            // console.log(`LOADING: ${loading}`)
            NProgress.start();
        }

        const End = (url) => {
            // console.log(`END ${url}`)
            if(url == router.asPath) setLoading(false);
            // console.log(router.asPath, url)
            // console.log(`LOADING: ${loading}`)
            NProgress.done();
        }
        
        router.events.on('routeChangeStart', Start)
        router.events.on('routeChangeComplete', End)
        router.events.on('routeChangeError', End)
    
        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
          router.events.off('routeChangeStart', Start)
          router.events.off('routeChangeComplete', End)
          router.events.off('routeChangeError', End)
        }
      }, [])
    return (
        <>
        {/* {loading && <Spinner color="primary" />} */}
        <Component {...pageProps} />
        </>
    )
}
export default MyApp;