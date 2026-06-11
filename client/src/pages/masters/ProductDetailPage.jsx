import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link for toolbar navigation
import { getUoms } from "../../services/uomService";
import {
  getProductByCode,
  getProductUoms,
   addProductUom,
} from "../../services/productServices";


import "../../styles/productDetail.css";

function ProductDetailPage() {
  const { productCode } = useParams();

  const [product, setProduct] = useState(null);
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUomModal, setShowUomModal] =
  useState(false);

const [allUoms, setAllUoms] = useState([]);

const [uomForm, setUomForm] = useState({
  uomName: "",
  conversionFactor: "",
  barcode: "",
});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
  productData,
  uomData,
  masterUoms,
] = await Promise.all([
  getProductByCode(productCode),
  getProductUoms(productCode),
  
  getUoms(),
]);
setAllUoms(masterUoms),
        setProduct(productData);
        setUoms(uomData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productCode]);

  if (loading) return <div className="loading-state"><h2>Loading Product...</h2></div>;
  if (!product) return <div className="error-state"><h2>Product Not Found</h2></div>;
const availableUoms = allUoms.filter(
  (masterUom) =>
    !uoms.some(
      (assignedUom) =>
        assignedUom.uom.name ===
        masterUom.name
    )
);

const handleAddUom = async (e) => {
  e.preventDefault();

  try {
    await addProductUom(
      productCode,
      uomForm.uomName,
      {
        conversionFactor: Number(
          uomForm.conversionFactor
        ),
        barcode: uomForm.barcode,
      }
    );

    const updatedUoms =
      await getProductUoms(productCode);

    setUoms(updatedUoms);

    setShowUomModal(false);

    setUomForm({
      uomName: "",
      conversionFactor: "",
      barcode: "",
    });

  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data ||
      "Failed to add UOM"
    );
  }
};
  return (
    <>
    <div className="product-detail-page">
      
      {/* TOOLBAR / BREADCRUMBS */}
      <div className="product-toolbar">
        <div className="breadcrumbs">
          <Link to="/products" className="breadcrumb-link">Product</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">{product.productCode}</span>
        </div>
        <div className="toolbar-actions">
          {/* You can add action buttons here later (e.g., Edit, Export) */}
          <button className="btn-secondary" onClick={() => window.print()}>Print</button>
        </div>
      </div>

      {/* PRODUCT HEADER CARD */}
      <div className="product-header-card">
        <div className="product-header-top">
          <div>
            <div className="product-badge-row">
              <span className="product-code-badge">{product.productCode}</span>
              <span className={`status-badge ${product.active ? "status-active" : "status-inactive"}`}>
                {product.active ? "Active" : "Inactive"}
              </span>
            </div>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-description">{product.description || "No description provided."}</p>
          </div>
        </div>

        <div className="product-meta-grid">
          <div className="meta-item">
            <label>Price</label>
            <div className="meta-value price-value">
              {Number(product.basePrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="meta-item">
            <label>Min Stock</label>
            <div className="meta-value">{product.minStockLevel}</div>
          </div>

          <div className="meta-item">
            <label>Created At</label>
            <div className="meta-value date-value">
              {new Date(product.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* UOM SECTION */}
      <div className="uom-section">
        <div className="section-header">

  <h2>Product Units of Measure (UOM)</h2>

  <button
    className="btn-primary"
    onClick={() =>
      setShowUomModal(true)
    }
  >
    Add UOM
  </button>

</div>

        <div className="table-container">
          <table className="uom-table">
            <thead>
              <tr>
                <th>UOM</th>
                <th>Description</th>
                <th>Conversion Factor</th>
                <th>Barcode</th>
              </tr>
            </thead>
            <tbody>
              {uoms.length > 0 ? (
                uoms.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.uom?.name || "N/A"}</td>
                    <td className="text-muted">{u.uom?.description || "—"}</td>
                    <td>{u.conversionFactor}</td>
                    <td className="barcode-cell">{u.barcode || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-table-state">No UOM variations mapped to this product.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
    {showUomModal && (
  <div className="modal-overlay">

    <div className="modal">

      <div className="modal-header">
        <h3>Add Product UOM</h3>
      </div>

      <form onSubmit={handleAddUom}>

        <div className="form-group">
          <label>UOM</label>

          <select
            value={uomForm.uomName}
            onChange={(e) =>
              setUomForm({
                ...uomForm,
                uomName: e.target.value,
              })
            }
            required
          >
            <option value="">
              Select UOM
            </option>

            {availableUoms.map((uom) => (
              <option
                key={uom.id}
                value={uom.name}
              >
                {uom.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            Conversion Factor
          </label>

          <input
            type="number"
            step="0.01"
            value={
              uomForm.conversionFactor
            }
            onChange={(e) =>
              setUomForm({
                ...uomForm,
                conversionFactor:
                  e.target.value,
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Barcode</label>

          <input
            type="text"
            value={uomForm.barcode}
            onChange={(e) =>
              setUomForm({
                ...uomForm,
                barcode:
                  e.target.value,
              })
            }
          />
        </div>

        <div className="modal-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setShowUomModal(false)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
          >
            Save
          </button>

        </div>

      </form>

    </div>

  </div>
)}
    </>
  );
}

export default ProductDetailPage;