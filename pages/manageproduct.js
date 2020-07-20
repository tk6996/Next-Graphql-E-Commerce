import React, { useState } from "react";
import ManageProductForm from "../components/ManageProductForm";
import UserProducts from "../components/UserProducts";

const ManageProduct = () => {
  const [addForm, setAddForm] = useState(false);
  return (
    <>
      {addForm && <ManageProductForm showForm={setAddForm} />}
      <UserProducts addForm={addForm} setAddForm={setAddForm} />
    </>
  );
};

export default ManageProduct;
