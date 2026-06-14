import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getProducts,
  getProductUoms,
} from "../../services/productServices";

import { getWarehouses } from "../../services/warehouseService";

import { createPurchase } from "../../services/purchaseService";

import "../../styles/createPurchase.css";

function CreatePurchasePage() {
  const navigate = useNavigate();

  const [supplierName, setSupplierName] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [vatPercent, setVatPercent] =
    useState(0);

  const [products, setProducts] =
    useState([]);

  const [warehouses, setWarehouses] =
    useState([]);

  const [items, setItems] =
    useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, warehouseData] =
          await Promise.all([
            getProducts(),
            getWarehouses(),
          ]);

        setProducts(productData);
        setWarehouses(warehouseData);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      {
        productCode: "",
        uomName: "",
        warehouseName: "",
        quantity: 1,
        costPrice: 0,
        availableUoms: [],
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  const updateItem = (
    index,
    field,
    value
  ) => {
    const updated = [...items];

    updated[index][field] = value;

    setItems(updated);
  };

  const handleProductChange =
    async (index, productCode) => {
      const updated = [...items];

      updated[index].productCode =
        productCode;

      updated[index].uomName = "";

      try {
        const uoms =
          await getProductUoms(
            productCode
          );

        updated[index].availableUoms =
          uoms;
      } catch (error) {
        console.error(error);
      }

      setItems(updated);
    };

  const subTotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.costPrice || 0),
    0
  );

  const vatAmount =
    (subTotal *
      Number(vatPercent || 0)) /
    100;
    const disAmount = (subTotal*discount/100);
  const netTotal =
    subTotal -
    Number(disAmount || 0) +
    vatAmount;

  const handleSave = async () => {
    try {
      if (!supplierName.trim()) {
        alert(
          "Supplier name is required."
        );
        return;
      }

      if (items.length === 0) {
        alert(
          "Add at least one item."
        );
        return;
      }

      const payload = {
        supplierName,
        discount:
          Number(discount),
        vat:
          Number(vatPercent),
        items: items.map((item) => ({
          productCode:
            item.productCode,
          uomName:
            item.uomName,
          warehouseName:
            item.warehouseName,
          quantity:
            Number(item.quantity),
          costPrice:
            Number(item.costPrice),
        })),
      };

      const purchase =
        await createPurchase(
          payload
        );

      navigate(
        `/purchases/${purchase.id}`
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create purchase."
      );
    }
  };

  return (
    <div className="create-purchase-page">

      <div className="page-toolbar">
        <div className="breadcrumbs">
          <Link
            to="/purchases"
            className="breadcrumb-link"
          >
            Purchases
          </Link>

          <span>&gt;</span>

          <span>
            New Purchase
          </span>
        </div>
      </div>

      <div className="page-card">
        <h1>
          New Purchase Order
        </h1>

        <p>
          Create supplier purchase
          and receive inventory.
        </p>
      </div>

      <div className="page-card">
        <h2>
          Supplier Information
        </h2>

        <input
          className="form-input"
          type="text"
          placeholder="Supplier Name"
          value={supplierName}
          onChange={(e) =>
            setSupplierName(
              e.target.value
            )
          }
        />
      </div>

      <div className="page-card">

        <div className="section-header">
          <h2>
            Purchase Items
          </h2>

          <button
            className="btn-primary"
            onClick={addItem}
          >
            + Add Item
          </button>
        </div>

        <div className="table-container">

          <table className="purchase-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>UOM</th>
                <th>Warehouse</th>
                <th>Qty</th>
                <th>Cost</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {items.map(
                (item, index) => (
                  <tr key={index}>

                    <td>
                      <select
                        value={
                          item.productCode
                        }
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select
                        </option>

                        {products.map(
                          (p) => (
                            <option
                              key={p.id}
                              value={
                                p.productCode
                              }
                            >
                              {p.name}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      <select
                        value={
                          item.uomName
                        }
                        onChange={(e) =>
                          updateItem(
                            index,
                            "uomName",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select
                        </option>

                        {item.availableUoms?.map(
                          (u) => (
                            <option
                              key={u.id}
                              value={
                                u.uom.name
                              }
                            >
                              {
                                u.uom.name
                              }
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      <select
                        value={
                          item.warehouseName
                        }
                        onChange={(e) =>
                          updateItem(
                            index,
                            "warehouseName",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select
                        </option>

                        {warehouses.map(
                          (w) => (
                            <option
                              key={w.id}
                              value={
                                w.name
                              }
                            >
                              {w.name}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        value={
                          item.quantity
                        }
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        value={
                          item.costPrice
                        }
                        onChange={(e) =>
                          updateItem(
                            index,
                            "costPrice",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      {(
                        Number(
                          item.quantity
                        ) *
                        Number(
                          item.costPrice
                        )
                      ).toFixed(2)}
                    </td>

                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          removeItem(
                            index
                          )
                        }
                      >
                        Remove
                      </button>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      <div className="summary-card">

        <h2>
          Order Summary
        </h2>

        <div className="summary-row">
          <span>
            Subtotal
          </span>

          <strong>
            {subTotal.toFixed(2)}
          </strong>
        </div>

        <div className="summary-row">
          <span>
            Discount(%)
          </span>

          <input
            type="number"
            value={discount}
            onChange={(e) =>
              setDiscount(
                e.target.value
              )
            }
          />
        </div>
<div className="summary-row">
          <span>
            Discount Amount
          </span>

          <strong>
            {disAmount.toFixed(2)}
          </strong>
        </div>
        <div className="summary-row">
          <span>
            VAT(%)
          </span>

          <input
            type="number"
            value={vatPercent}
            onChange={(e) =>
              setVatPercent(
                e.target.value
              )
            }
          />
        </div>

        <div className="summary-row">
          <span>
            VAT Amount
          </span>

          <strong>
            {vatAmount.toFixed(2)}
          </strong>
        </div>

        <hr />

        <div className="summary-row total-row">
          <span>
            Net Total
          </span>

          <strong>
            {netTotal.toFixed(2)}
          </strong>
        </div>

        <button
          className="btn-primary save-btn"
          onClick={handleSave}
        >
          Save Purchase
        </button>

      </div>

    </div>
  );
}

export default CreatePurchasePage;