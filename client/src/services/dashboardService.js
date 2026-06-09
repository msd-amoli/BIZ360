import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getPurchases = async () => {
  const response = await api.get("/purchases");
  return response.data;
};

export const getInvoices = async () => {
  const response = await api.get("/invoices");
  return response.data;
};

export const getInventory = async () => {
  const response = await api.get("/inventory");
  return response.data;
};

export const getLowStock = async () => {
  const response = await api.get("/inventory/low-stock");
  return response.data;
};