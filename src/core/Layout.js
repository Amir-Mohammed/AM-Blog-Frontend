import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div style={{ paddingBottom: 70 }}>
          <Header />
          <ToastContainer />
          {children}
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Layout;
