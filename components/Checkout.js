import React from "react";
import Script from "react-load-script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Checkout = ({ amount, handleCheckout }) => {
  let OmiseCard;

  const handleLoadScript = () => {
    OmiseCard = window.OmiseCard;
    OmiseCard.configure({
      publicKey: process.env.OMISE_PUBLIC_KEY,
      currency: "thb",
      frameLabel: "Tea Shop",
      submitLabel: "PAY NOW",
      buttonLabel: "Pay with Omise",
    });
  };

  const creditCardConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: "credit_card",
      otherPaymentMethods: [],
    });
    OmiseCard.configureButton("#credit-card");
    OmiseCard.attach();
  };

  const internetBankingConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: "internet_banking",
      otherPaymentMethods: [
        "bill_payment_tesco_lotus",
        "alipay",
        "pay_easy",
        "net_banking",
        "convenience_store",
      ],
    });
    OmiseCard.configureButton("#internet-banking");
    OmiseCard.attach();
  };

  const omiseCardHandler = (type) => {
    OmiseCard.open({
      frameDescription: "Invoice #3847",
      amount: amount,
      onCreateTokenSuccess: (token) => {
        handleCheckout(
          amount,
          null,
          token,
          type === "internet_banking" ? "http://localhost:3000" : null
        );
      },
      onFormClosed: null,
    });
  };

  const handleClick = (type) => {
    if (type === "credit_card") creditCardConfigure();
    if (type === "internet_banking") internetBankingConfigure();
    omiseCardHandler(type);
  };

  return (
    <div>
      <style jsx>
        {`
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
            cursor: ${amount ? "pointer" : "not-allowed"};
          }
          button:active {
            transform: ${amount ? "scale(0.9, 0.9)" : "none"};
          }
        `}
      </style>
      <Script url="https://cdn.omise.co/omise.js" onLoad={handleLoadScript} />
      <form>
        <button
          id="credit-card"
          type="button"
          disabled={!amount}
          onClick={() => {
            handleClick("credit_card");
          }}
          style={{ backgroundColor: amount ? "#03c" : "#ccc" }}
        >
          <FontAwesomeIcon icon="credit-card" />
        </button>
        <button
          id="internet-banking"
          type="button"
          disabled={!amount}
          onClick={() => {
            handleClick("internet_banking");
          }}
          style={{ backgroundColor: amount ? "#30c" : "#ccc" }}
        >
          <FontAwesomeIcon icon="university" />
        </button>
      </form>
    </div>
  );
};

export default Checkout;
