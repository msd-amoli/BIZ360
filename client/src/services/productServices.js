import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};
export const getProductByCode = async (
  productCode
) => {
  const response = await api.get(
    `/products/${productCode}`
  );

  return response.data;
};
export const getProductUoms = async (
  productCode
) => {
  const response = await api.get(
    `/products/${productCode}/uoms`
  );

  return response.data;
};