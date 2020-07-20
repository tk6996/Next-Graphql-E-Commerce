import React from "react";
import Head from "next/head";
import NavigatorBar from "./NavigatorBar";

const PageLayout = ({ children }) => {
  return (
    <div>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
      `}</style>
      <Head>
        <title>My Shop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigatorBar />
      {children}
    </div>
  );
};

export default PageLayout;
