import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@apollo/react-hooks";
import Loading from "./Loading";
import { QUERY_PRODUCTS, ME } from "../schema/query";
import { DELETE_PRODUCT, UPDATE_PRODUCT } from "../schema/mutation";

const UserProductItem = ({ product, setError }) => {
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(product);

  const [updateProduct, { loadingUpdate }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: QUERY_PRODUCTS }, { query: ME }],
    onCompleted: (data) => {
      if (data) {
        setProductData(data.updateProduct);
        setEdit(false);
      }
    },
  });

  const [deleteProduct, { loadingDelete }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: QUERY_PRODUCTS }, { query: ME }],
  });

  const handleChange = (e) =>
    setProductData({ ...productData, [e.target.name]: e.target.value });

  const selectFile = (e) => {
    const files = e.target.files;
    setFile(files[0]);
  };

  const uploadFile = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "next-graphql-filestore");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/tk6996cloudinary/image/upload",
      {
        method: "post",
        body: data,
      }
    );
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!file && productData === product) {
      setProductData(product);
      setEdit(false);
      return;
    }
    setLoading(true);
    try {
      let url = "";
      if (file) {
        url = await uploadFile();
      }
      await updateProduct({
        variables: {
          ...productData,
          imageUrl: url || productData.imageUrl,
          price: Number(productData.price),
        },
      });
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProduct({ variables: { id: productData.id } });
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
        div:nth-child(4n) {
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
        div > input {
          height: 30px;
          padding: 0 5px;
          font-size: 16px;
          text-align: center;
        }
        div > input:focus {
          outline-color: #00c;
        }
        div > input[type="file"]:focus {
          outline: none;
        }
      `}</style>
      <div>
        {edit ? (
          <input
            type="text"
            name="description"
            value={productData.description}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        ) : (
          productData.description
        )}
      </div>
      <div>
        {edit ? (
          <input
            type="file"
            name="file"
            style={{ width: "100%" }}
            onChange={selectFile}
          />
        ) : (
          <img
            src={productData.imageUrl}
            alt={productData.description}
            width="50px"
          />
        )}
      </div>
      <div>
        {edit ? (
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            style={{ width: "50%" }}
          />
        ) : (
          productData.price + " ฿"
        )}
      </div>
      <div>
        {edit ? (
          <>
            <button
              style={{ backgroundColor: "#0f0" }}
              onClick={handleSubmit}
              disabled={loading || loadingUpdate}
            >
              <FontAwesomeIcon icon="check" />
            </button>
            <button
              style={{
                backgroundColor: "#f00",
              }}
              onClick={() => {
                setProductData(product);
                setError(null);
                setEdit(false);
              }}
              disabled={loading || loadingUpdate}
            >
              <FontAwesomeIcon icon="times" />
            </button>
          </>
        ) : (
          <>
            <button
              style={{ backgroundColor: "#cc0" }}
              onClick={() => setEdit(true)}
            >
              <FontAwesomeIcon icon="edit" />
            </button>
            <button
              style={{ backgroundColor: "#f00" }}
              onClick={() => {
                if (
                  window.confirm(
                    `You do want to delete ${productData.description}.`
                  )
                )
                  handleDelete();
              }}
              disabled={loading || loadingDelete}
            >
              <FontAwesomeIcon icon="trash" />
            </button>
          </>
        )}
        {(loading || loadingUpdate || loadingDelete) && <Loading />}
      </div>
    </>
  );
};

export default UserProductItem;
