import api from "./api";

export const searchErpData = async (query) => {
  if (!query || query.trim().length < 2) return { purchases: [], invoices: [], products: [] };
  
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data; 
    /* Expecting backend response format:
       {
         purchases: [{ id: "PO1002", supplier: "Logistics Corp" }],
         invoices: [{ id: "INV1001", client: "Acme Corp" }],
         products: [{ productCode: "PROD991", name: "Industrial Valve" }]
       }
    */
  } catch (error) {
    console.error("Error fetching global search results:", error);
    return { purchases: [], invoices: [], products: [] };
  }
};