import "../styles/globals.css";

// React Toastify Popup
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";


// next auth Session Provider
import { SessionProvider } from "next-auth/react";

// Page Changing Loading Effect
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import Router from "next/router";
NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});
Router.events.on("routeChangeError", () => {
  NProgress.done();
});

// React Context API
import ContextProvider from "../context";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps?.session}>
      <ContextProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </ContextProvider>
    </SessionProvider>
  );
}
