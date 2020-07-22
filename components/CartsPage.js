import React, { useContext, useState } from "react";
import Router from "next/router";
import { AuthContext } from "../appState/AuthProvider";
import { useMutation } from "@apollo/react-hooks";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import CardItem from "./CardItem";
import { ME } from "../schema/query";
import { CREATE_ORDER } from "../schema/mutation";
import Loading from "./Loading";

const CartsPage = () => {
  const { user } = useContext(AuthContext);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);

  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: ME }],
    onCompleted: (data) => {
      if (data) {
        if (data.createOrder.authorize_uri) {
          window.location.href = data.createOrder.authorize_uri;
        } else {
          Router.push("/");
        }
      }
    },
  });

  const calcuateAmount = (carts) => {
    if (!Array.isArray(carts)) return 0;
    const amount = Math.round(
      carts.reduce((sum, cart) => sum + cart.quantity * cart.product.price, 0) *
        100
    );
    return amount;
  };

  const handleCheckout = async (amount, cardId, token, return_uri) => {
    setLoadingCheckOut(true);
    await createOrder({
      variables: { amount, cardId, token, return_uri },
    });
    setLoadingCheckOut(false);
  };

  return (
    <div
      style={{
        margin: "100px auto 25px",
      }}
    >
      <style jsx>{`
        .table {
          display: grid;
          max-width: 900px;
          grid-template-columns: 0.5fr 1.1fr 0.8fr 0.8fr 0.5fr 0.8fr;
          margin: 45px auto;
        }
        .table > div {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          border: 1px solid #999;
          border-right-width: 0;
          background-color: #ccc;
          font-weight: bold;
        }
        .table > div:nth-child(6n) {
          border-right-width: 1px;
        }
        .table > div:nth-last-child(-n + 6) {
          border-top-width: 0;
          background-color: #ff0;
          color: #f00;
        }
        .credit-card {
          display: grid;
          max-width: 600px;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          margin: 45px auto;
        }
        .credit-card > div {
          text-align: center;
          padding: 10px;
          border: 1px solid #999;
          border-right-width: 0;
        }
        .credit-card > div:nth-child(-n + 4) {
          font-weight: bold;
          background-color: #eee;
        }
        .credit-card > div:nth-child(4n) {
          border-right-width: 1px;
        }
        .credit-card > div:nth-child(1) {
          border-top-left-radius: 10px;
        }
        .credit-card > :nth-child(4) {
          border-top-right-radius: 10px;
        }
      `}</style>
      <h1 style={{ margin: "15px", textAlign: "center" }}>My Carts</h1>
      <div className="table">
        <div>Order</div>
        <div>Description</div>
        <div>Picture</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Action</div>
        {user?.carts.map((cart, index) => (
          <CartItem cart={cart} index={index} key={cart.id} />
        ))}
        <div>Total</div>
        <div></div>
        <div></div>
        <div>
          {user?.carts?.length ? calcuateAmount(user.carts) / 100 : 0}
          {" ฿"}
        </div>
        <div>
          {user?.carts?.length
            ? user.carts.reduce((sum, cart) => sum + cart.quantity, 0)
            : 0}
        </div>
        <div>
          <Checkout
            amount={calcuateAmount(user?.carts)}
            handleCheckout={handleCheckout}
          />
        </div>
      </div>
      {user?.cards?.length && (
        <>
          <h1 style={{ margin: "15px", textAlign: "center" }}>My Cards</h1>
          <div className="credit-card">
            <div>Last Digits</div>
            <div>Brand</div>
            <div>Expiration Date</div>
            <div>Action</div>
            {user.cards.map((card) => (
              <CardItem
                cardInfo={card.cardInfo}
                key={card.id}
                handleClick={() => {
                  const amount = calcuateAmount(user.carts);
                  handleCheckout(amount, card.id);
                }}
              />
            ))}
          </div>
        </>
      )}
      {(loading || loadingCheckOut) && <Loading />}
      {error && (
        <p style={{ color: "#f33" }}>{error.graphQLErrors[0].message}</p>
      )}
    </div>
  );
};

export default CartsPage;
