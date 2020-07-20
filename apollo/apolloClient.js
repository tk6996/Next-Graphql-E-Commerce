import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-unfetch";
import withApollo from "next-with-apollo";
import cookie from "cookie";

const uri = "http://localhost:4000/graphql";

const httpLink = createHttpLink({ uri, fetch });

const authLink = setContext((_, { headers }) => {
  let cookies;
  // Server Side
  if (headers) {
    cookies = cookie.parse(header.cookie || "");
  }
  //Client Side
  if (typeof window !== "undefined") {
    cookies = cookie.parse(document.cookie || "");
  }

  const token = cookies.jwt || "";

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export default withApollo(
  ({ initalState }) => {
    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache().restore(initalState || {}),
    });
  }
);
