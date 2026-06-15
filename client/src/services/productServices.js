import api from "./api";

export const createProduct = async (data)=>{
  const response = await api.post("/products",data);
  return response.data;
}

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
export const addProductUom = async (
  productCode,
  uomName,
  payload
) => {
  const response = await api.post(
    `/products/${productCode}/uoms?uomName=${uomName}`,
    payload
  );

  return response.data;
};