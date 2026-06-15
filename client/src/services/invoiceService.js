import api from "./api";

export const getInvoices = async () => {
  const response = await api.get("/invoices");
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

export const getInvoiceByNumber = async (
  invoiceNumber
) => {
  const response = await api.get(
    `/invoices/number/${invoiceNumber}`
  );

  return response.data;
};

export const getInvoicesByCustomer =
  async (customerName) => {
    const response = await api.get(
      `/invoices/customer/${customerName}`
    );

    return response.data;
  };

export const createInvoice = async (
  data
) => {
  const response = await api.post(
    "/invoices",
    data
  );

  return response.data;
};

export const cancelInvoice = async (
  id
) => {
  const response = await api.put(
    `/invoices/${id}/cancel`
  );

  return response.data;
};