import React, { useContext } from "react";
import Link from "next/link";
import Router from "next/router";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../appState/AuthProvider";
import Loading from "./Loading";
import { ADD_TO_CART } from "../schema/mutation";
import { ME } from "../schema/query";

const ProductItem = ({ product }) => {
  const { user } = useContext(AuthContext);

  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    refetchQueries: [
      {
        query: ME,
      },
    ],
  });

  const handleAddtoCart = async (id) => {
    if (!user) return Router.push("/signin");
    await addToCart({ variables: { id } });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "250px",
        margin: "10px",
        boxShadow: "0 4px 8px 0 #0003 , 0 -2px 8px 0 #0003",
        borderRadius: "15px",
        padding: "10px",
      }}
    >
      <Link
        key={product.id}
        href="/products/[productId]"
        as={`/products/${product.id}`}
      >
        <a>
          <img
            id={`img${product.id}`}
            src={product.imageUrl}
            alt={product.description}
            width={250}
            height={250}
            style={{ objectFit: "contain" }}
          />
        </a>
      </Link>
      <h3>{product.description}</h3>
      <h4>{product.price} ฿</h4>
      <style jsx>{`
        button {
          padding: 10px;
          background-color: ${user?.id === product.user.id ? "#00c" : "#0c0"};
          color: #fff;
          border-radius: 5px;
          border: none;
          outline: none;
          cursor: pointer;
          font-weight: bold;
        }

        button:active {
          transform: scale(0.9, 0.9);
        }
      `}</style>
      {user?.id === product.user.id ? (
        <button
          type="button"
          onClick={() => Router.push("/manageproduct")}
          disabled={loading}
        >
          Manage Product
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleAddtoCart(product.id)}
          disabled={loading}
        >
          Add to Cart
        </button>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default ProductItem;
