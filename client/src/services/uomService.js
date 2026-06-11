import api from "./api";

export const getUoms = async () => {
  const response = await api.get("/uoms");
  return response.data;
};
export const createUom = async (payload) => {
  const response = await api.post(
    "/uoms",
    payload
  );

  return response.data;
};

export const updateUom = async (
  id,
  payload
) => {
  const response = await api.put(
    `/uoms/${id}`,
    payload
  );

  return response.data;
};

export const searchUoms = async (
  name
) => {
  const response = await api.get(
    `/uoms/search?name=${name}`
  );

  return response.data;
};