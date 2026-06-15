import "../../styles/products.css";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productServices";
import { Link,useNavigate } from "react-router-dom";
function ProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(
        "Products Load Failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, []);
const filteredProducts = products.filter(
  (product) =>
    product.name
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      ) ||
    product.productCode
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )
);
if (loading) {
  return <h2>Loading Products...</h2>;
}
  return (
    <div className="products-page">
      <div className="products-header">
        <div className="products-title">
          <h1>Products</h1>

          <p>
            Manage products and inventory
            items
          </p>
        </div>

     <Link
          to="/products/new"
          className="btn-primary"
        >
          + New
        </Link>
      </div>

      <div className="products-toolbar">
        <input
  type="text"
  placeholder="Search products..."
  className="search-input"
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
/>
      </div>
      <div className="products-table-wrapper">
  <table className="products-table">
    <thead>
      <tr>
        <th>Code</th>
        <th>Name</th>
        <th>Price</th>
        <th>Min Stock</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {filteredProducts.map((product) => (
        <tr
          key={product.id}
          className="clickable-row"
          onClick={() =>
            navigate(
              `/products/${product.productCode}`
            )
          }
        >
          <td>{product.productCode}</td>

          <td>{product.name}</td>

          <td>
            {Number(
              product.basePrice
            ).toFixed(2)}
          </td>

          <td>
            {product.minStockLevel}
          </td>

          <td>
            <span
              className={
                product.active
                  ? "status-active"
                  : "status-inactive"
              }
            >
              {product.active
                ? "Active"
                : "Inactive"}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default ProductsPage;