import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createProduct } from "../../services/productServices";

import "../../styles/createPurchase.css";

function CreateProductPage() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      productCode: "",
      name: "",
      description: "",
      basePrice: "",
      minStockLevel: "",
      active: true,
    });

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSave =
    async () => {
      try {
        if (
          !form.productCode.trim()
        ) {
          alert(
            "Product code is required."
          );
          return;
        }

        if (
          !form.name.trim()
        ) {
          alert(
            "Product name is required."
          );
          return;
        }

        if (
          !form.basePrice
        ) {
          alert(
            "Base price is required."
          );
          return;
        }

        const payload = {
          productCode:
            form.productCode,
          name: form.name,
          description:
            form.description,
          basePrice: Number(
            form.basePrice
          ),
          minStockLevel:
            Number(
              form.minStockLevel ||
                0
            ),
          active:
            form.active,
        };

        const product =
          await createProduct(
            payload
          );

        navigate(
          `/products/${product.productCode}`
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to create product."
        );
      }
    };

  return (
    <div className="create-purchase-page">

      <div className="page-toolbar">
        <div className="breadcrumbs">

          <Link
            to="/products"
            className="breadcrumb-link"
          >
            Products
          </Link>

          <span>&gt;</span>

          <span>
            New Product
          </span>

        </div>
      </div>

      <div className="page-card">
        <h1>
          New Product
        </h1>

        <p>
          Create a new
          inventory product.
        </p>
      </div>

      <div className="page-card">

        <h2>
          Product Information
        </h2>

        <div className="form-grid">

          <div>
            <label>
              Product Code
            </label>

            <input
              className="form-input"
              type="text"
              name="productCode"
              value={
                form.productCode
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              Product Name
            </label>

            <input
              className="form-input"
              type="text"
              name="name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              Base Price
            </label>

            <input
              className="form-input"
              type="number"
              min="0"
              name="basePrice"
              value={
                form.basePrice
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              Minimum Stock
            </label>

            <input
              className="form-input"
              type="number"
              min="0"
              name="minStockLevel"
              value={
                form.minStockLevel
              }
              onChange={
                handleChange
              }
            />
          </div>

        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            Description
          </label>

          <textarea
            className="form-input"
            rows="4"
            name="description"
            value={
              form.description
            }
            onChange={
              handleChange
            }
          />
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            <input
              type="checkbox"
              name="active"
              checked={
                form.active
              }
              onChange={
                handleChange
              }
            />

            {" "}
            Active Product
          </label>
        </div>

      </div>

      <div className="summary-card">

        <h2>
          Product Summary
        </h2>

        <div className="summary-row">
          <span>
            Product Code
          </span>

          <strong>
            {form.productCode ||
              "-"}
          </strong>
        </div>

        <div className="summary-row">
          <span>
            Product Name
          </span>

          <strong>
            {form.name ||
              "-"}
          </strong>
        </div>

        <div className="summary-row">
          <span>
            Base Price
          </span>

          <strong>
            {Number(
              form.basePrice ||
                0
            ).toFixed(2)}
          </strong>
        </div>

        <div className="summary-row">
          <span>
            Minimum Stock
          </span>

          <strong>
            {Number(
              form.minStockLevel ||
                0
            ).toFixed(2)}
          </strong>
        </div>

        <div className="summary-row">
          <span>
            Status
          </span>

          <strong>
            {form.active
              ? "Active"
              : "Inactive"}
          </strong>
        </div>

        <button
          className="btn-primary save-btn"
          onClick={
            handleSave
          }
        >
          Save Product
        </button>

      </div>

    </div>
  );
}

export default CreateProductPage;