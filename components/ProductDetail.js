import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loading from "./Loading";
import { AuthContext } from "../appState/AuthProvider";
import { ME, QUERY_PRODUCT } from "../schema/query";
import { ADD_TO_CART } from "../schema/mutation";

const ProductDetail = () => {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const [loadingAddToCart, setLoadingAddToCart] = useState(false);

  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: [
      {
        query: ME,
      },
    ],
  });

  const { data, loading, error } = useQuery(QUERY_PRODUCT, {
    variables: { id: router.query.productId },
  });

  if (error) {
    console.error(error);
    return (
      <p style={{ color: "#f33", margin: "15px" }}>Please try again later.</p>
    );
  }

  if (loading) return <Loading />;

  const handleAddtoCart = async (id) => {
    if (!user) return router.push("/signin");
    setLoadingAddToCart(true);
    await addToCart({ variables: { id } });
    setLoadingAddToCart(false);
  };

  return data.product.user ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img
          src={data.product.imageUrl}
          alt={data.product.description}
          width={250}
          height={250}
          style={{ objectFit: "contain" }}
        />
        <h3>{data.product.description}</h3>
        <h4>{data.product.price} ฿</h4>
        <style jsx>{`
          button {
            padding: 10px;
            background-color: ${user?.id === data.product.user.id
              ? "#00c"
              : "#0c0"};
            color: #fff;
            border-radius: 5px;
            border: none;
            outline: none;
            cursor: pointer;
          }

          button:active {
            transform: scale(0.9, 0.9);
          }
        `}</style>
        {user?.id === data.product.user.id ? (
          <button
            type="button"
            onClick={() => router.push("/manageproduct")}
            disabled={loadingAddToCart}
          >
            Manage Product
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleAddtoCart(router.query.productId)}
            disabled={loadingAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
      {loadingAddToCart && <Loading />}
    </div>
  ) : (
    <p style={{ color: "#f33", margin: "15px" }}>ProductID not found.</p>
  );
};

export default ProductDetail;
