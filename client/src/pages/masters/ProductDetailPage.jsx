import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link for toolbar navigation

import {
  getProductByCode,
  getProductUoms,
} from "../../services/productServices";

import "../../styles/productDetail.css";

function ProductDetailPage() {
  const { productCode } = useParams();

  const [product, setProduct] = useState(null);
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, uomData] = await Promise.all([
          getProductByCode(productCode),
          getProductUoms(productCode),
        ]);

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

  return (
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
  );
}

export default ProductDetailPage;