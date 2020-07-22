import React, { useContext } from "react";
import { AuthContext } from "../appState/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CardItem = ({ cardInfo, handleClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <style jsx>{`
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          border: 1px solid #999;
          border-right-width: 0;
          border-top-width: 0;
        }
        div:nth-child(4n) {
          border-right-width: 1px;
        }
        div:nth-last-child(1) {
          border-bottom-right-radius: 10px;
        }
        div:nth-last-child(4) {
          border-bottom-left-radius: 10px;
        }
        button {
          margin: auto 5px;
          max-width: 60px;
          width: 30px;
          height: 30px;
          font-weight: bold;
          color: #fff;
          border-radius: 5px;
          border: none;
          outline: none;
          cursor: ${user?.carts?.length ? "pointer" : "not-allowed"};
        }
        button:active {
          transform: ${user?.carts?.length ? "scale(0.9, 0.9)" : "none"};
        }
      `}</style>
      <div>{cardInfo.last_digits}</div>
      <div>{cardInfo.brand}</div>
      <div>
        {cardInfo.expiration_month} / {cardInfo.expiration_year}
      </div>
      <div>
        <button
          id="credit-card"
          type="button"
          disabled={!user?.carts?.length}
          onClick={handleClick}
          style={{
            backgroundColor: user?.carts?.length ? "#03c" : "#ccc",
          }}
        >
          <FontAwesomeIcon icon="credit-card" />
        </button>
      </div>
    </>
  );
};

export default CardItem;
