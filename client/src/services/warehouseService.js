import api from "./api";

export const getWarehouses = async () => {
  const response = await api.get("/warehouses");
  return response.data;
};

export const createWarehouse = async (payload) => {
  const response = await api.post(
    "/warehouses",
    payload
  );
  return response.data;
};

export const updateWarehouse = async (
  id,
  payload
) => {
  const response = await api.put(
    `/warehouses/${id}`,
    payload
  );
  return response.data;
};

export const searchWarehouses = async (
  name
) => {
  const response = await api.get(
    `/warehouses/search?name=${name}`
  );
  return response.data;
};