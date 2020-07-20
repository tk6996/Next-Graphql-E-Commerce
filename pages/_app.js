// import App from 'next/app'
import { ApolloProvider } from "@apollo/react-hooks";
import PageLayout from "../components/PageLayout";
import AuthProvider from "../appState/AuthProvider";
import apolloClient from "../apollo/apolloClient";
import fetch from "isomorphic-unfetch";
import cookie from "cookie";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import {
  faEdit,
  faTrash,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
config.autoAddCss = false;
library.add(faEdit, faTrash, faCheck, faTimes);

const QUERY_USER = {
  query: `
    query {
      user {
        id
        name
        email
        products {
          id
          description
          imageUrl
          price
        }
        carts {
          id
          product {
            description
            price
            imageUrl
          }
          quantity
        }
      }
    }`,
};

function MyApp({ Component, pageProps, apollo, user }) {
  return (
    <ApolloProvider client={apollo}>
      <AuthProvider userData={user}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </AuthProvider>
    </ApolloProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async ({ ctx, router }) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  // const appProps = await App.getInitialProps(appContext);

  // return { ...appProps }
  if (process.browser) {
    return __NEXT_DATA__.props.pageProps;
  }

  const { headers } = ctx.req;

  const cookies = cookie.parse(headers?.cookie || "");

  const token = cookies?.jwt;

  const redirect = () => {
    if (
      [/^\/cart$/, /^\/manageproduct$/].findIndex((path) =>
        path.exec(router.pathname)
      ) > -1
    ) {
      ctx.res.writeHead(302, { Location: "/signin" });
      ctx.res.end();
    }
  };
  if (!token) {
    redirect();
    return null;
  }

  const response = await fetch("http://localhost:4000/graphql", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}` || "",
    },
    body: JSON.stringify(QUERY_USER),
  });
  if (response.ok) {
    const result = await response.json();
    if (
      [/^\/signin/, /^\/signup$/].findIndex((path) =>
        path.exec(router.pathname)
      ) > -1
    ) {
      ctx.res.writeHead(302, { Location: "/products" });
      ctx.res.end();
    }
    return { user: result.data.user };
  } else {
    redirect();
    return null;
  }
};

export default apolloClient(MyApp);
