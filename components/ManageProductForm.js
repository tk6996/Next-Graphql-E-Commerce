import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import fetch from "isomorphic-unfetch";
import Loading from "./Loading";
import { QUERY_PRODUCTS, ME } from "../schema/query";
import { CREATE_PRODUCT } from "../schema/mutation";

const ManageProductForm = ({ showForm }) => {
  const [file, setFile] = useState(null);
  const [uploadFileLoading, setUploadFileLoading] = useState(false);
  const [productData, setProductData] = useState({
    description: "",
    price: "",
  });

  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: QUERY_PRODUCTS }, { query: ME }],
    onCompleted: (data) => {
      if (data) {
        setProductData({ description: "", price: "" });
        showForm(false);
      }
    },
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

  const handleSubmit = async (e) => {
    setUploadFileLoading(true);
    try {
      e.preventDefault();
      const url = await uploadFile();
      await createProduct({
        variables: {
          ...productData,
          imageUrl: url,
          price: Number(productData.price),
        },
      });
    } catch (error) {
      console.error(error);
    }
    setUploadFileLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "100px",
      }}
    >
      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          width: 300px;
        }
        form > * {
          margin: 15px 0;
        }
        form > input {
          height: 30px;
          padding: 0 5px;
          font-size: 16px;
        }
        form > input:focus {
          outline-color: #00c;
        }
        form > input[type="file"]:focus {
          outline: none;
        }
        form > button {
          height: 35px;
          background-color: #c0c;
          color: #fff;
          border-radius: 5px;
          border: none;
          outline: none;
          cursor: ${!(productData.description && file && productData.price)
            ? "not-allowed"
            : "pointer"};
          font-weight: bold;
        }
        form > button:active {
          transform: scale(0.9, 0.9);
        }
        form > label {
          padding: 0 5px;
          font-size: 18px;
          font-family: Arial;
        }
      `}</style>
      <h1 style={{ textAlign: "center" }}>Manage Product Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={productData.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={productData.price}
          onChange={handleChange}
        />
        <label form="file">Product File</label>
        <input
          type="file"
          name="file"
          placeholder="Product Image"
          onChange={selectFile}
        />
        <button
          disabled={
            !(productData.description && file && productData.price) ||
            loading ||
            uploadFileLoading
          }
        >
          Submit
        </button>
      </form>
      {error && (
        <p style={{ color: "#f33" }}>{error.graphQLErrors[0].message}</p>
      )}
      {!(productData.description && file && productData.price) && (
        <p style={{ color: "#c33" }}>Please fill in all required fileds.</p>
      )}
      {(uploadFileLoading || loading) && <Loading />}
    </div>
  );
};

export default ManageProductForm;
