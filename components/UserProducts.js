import React, { useContext, useState } from "react";
import UserProductItem from "./UserProductItem";
import { AuthContext } from "../appState/AuthProvider";

const UserProducts = ({ addForm, setAddForm }) => {
  const { user } = useContext(AuthContext);
  const [errorProduct, setErrorProduct] = useState(null);

  return (
    <div style={{ margin: addForm ? "25px" : "100px" + " auto 25px" }}>
      <style jsx>{`
        .table {
          display: grid;
          max-width: 800px;
          grid-template-columns: 1fr 0.8fr 0.8fr 0.8fr;
          margin: 30px auto;
        }
        .table > div {
          text-align: center;
          padding: 10px;
          border: 1px solid #999;
          border-right-width: 0;
          background-color: #ccc;
          font-weight: bold;
        }

        .table > div:nth-child(4n) {
          border-right-width: 1px;
        }

        div > button {
          height: 35px;
          background-color: #0c0;
          color: #fff;
          border-radius: 5px;
          border: 1px solid;
          outline: none;
          cursor: pointer;
          font-weight: bold;
        }
        div > button:active {
          transform: scale(0.9, 0.9);
        }
      `}</style>
      <h1 style={{ textAlign: "center", margin: "30px auto" }}>
        Manage Product
      </h1>
      {addForm || (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "15px auto",
          }}
        >
          <button onClick={() => setAddForm(true)}>Add Product</button>
        </div>
      )}
      <div className="table">
        <div>Description</div>
        <div>Picture</div>
        <div>Price</div>
        <div>Action</div>
        {user?.products.map((product) => (
          <UserProductItem
            product={product}
            key={product.id}
            setError={setErrorProduct}
          />
        ))}
      </div>
      {errorProduct && (
        <p style={{ color: "#f33", textAlign: "center" }}>
          {errorProduct.graphQLErrors[0].message}
        </p>
      )}
    </div>
  );
};

export default UserProducts;
