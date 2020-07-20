import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_CART } from "../schema/mutation";
import { ME } from "../schema/query";
import Loading from "./Loading";

const CartItem = ({ cart, index }) => {
  const [loading, setLoading] = useState(false);
  const [deleteCart, { loadingDelete }] = useMutation(DELETE_CART, {
    refetchQueries: [{ query: ME }],
  });

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCart({ variables: { id: cart.id } });
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setLoading(false);
  };

  return (
    <>
      <style jsx>{`
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          border: 1px solid #999;
          border-top-width: 0;
          border-right-width: 0;
          height: 60px;
        }
        div:nth-child(6n) {
          border-right-width: 1px;
        }
        div > button {
          margin: auto 5px;
          max-width: 60px;
          width: 30px;
          height: 30px;
          font-weight: bold;
          color: #fff;
          border-radius: 5px;
          border: none;
          outline: none;
          cursor: pointer;
        }
        div > button:active {
          transform: scale(0.9, 0.9);
        }
      `}</style>
      <div>
        <strong>{index + 1}</strong>
      </div>
      <div>{cart.product.description}</div>
      <div>
        <img
          src={cart.product.imageUrl}
          alt={cart.product.description}
          width="50px"
        />
      </div>
      <div>{cart.product.price} ฿</div>
      <div>{cart.quantity}</div>
      <div>
        <button
          style={{ backgroundColor: "#f00" }}
          onClick={() => {
            if (
              window.confirm(
                `You do want to delete ${cart.product.description}.`
              )
            )
              handleDelete();
          }}
          disabled={loading || loadingDelete}
        >
          <FontAwesomeIcon icon="trash" />
        </button>
      </div>
      {(loading || loadingDelete) && <Loading />}
    </>
  );
};

export default CartItem;
