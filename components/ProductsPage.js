import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Loading from "./Loading";
import ProductItem from "./ProductItem";
import { QUERY_PRODUCTS } from "../schema/query";

const ProductsPage = () => {
  const { data, loading, error } = useQuery(QUERY_PRODUCTS);

  if (error) {
    console.error(error);
    return (
      <p style={{ color: "#f33", margin: "15px" }}>Please try again later.</p>
    );
  }

  if (loading) return <Loading />;

  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        gridTemplateColumns: "repeat(auto-fit,300px)",
        gridGap: "10px",
        margin: "10px auto",
      }}
    >
      {data?.products.map((product) => (
        <ProductItem product={product} key={product.id} />
      ))}
    </div>
  );
};

export default ProductsPage;
