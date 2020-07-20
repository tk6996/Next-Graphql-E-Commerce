import React, { useContext } from "react";
import { AuthContext } from "../appState/AuthProvider";
import CartItem from "./CartItem";

const CartsPage = () => {
  const { user } = useContext(AuthContext);
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
          text-align: center;
          padding: 10px;
          border: 1px solid #999;
          border-right-width: 0;
          background-color: #ccc;
          font-weight: bold;
        }
        .table > div:nth-child(6n) {
          border-right-width: 1px;
        }
        .table
          > div:nth-child(n
            + ${6 * (1 + (user ? (user.carts ? user.carts.length : 0) : 0)) +
            1}):nth-last-child(-n
            + ${6 * (2 + (user ? (user.carts ? user.carts.length : 0) : 0))}) {
          border-top-width: 0;
          background-color: #ff0;
          color: #f00;
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
          {user?.carts?.length
            ? Math.round(
                user.carts.reduce(
                  (sum, cart) => sum + cart.quantity * cart.product.price,
                  0
                ) * 100
              ) / 100
            : 0}
          {" ฿"}
        </div>
        <div>
          {user?.carts?.length
            ? user.carts.reduce((sum, cart) => sum + cart.quantity, 0)
            : 0}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CartsPage;
