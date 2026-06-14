import api from "./api";

export const getPurchases = async()=>{
    const res = await api.get("/purchases");
    return res.data;
}

export const getPurchaseById = async(id)=>{
    const res = await api.get(`/purchases/${id}`);
    return res.data;
}

export const getPurchaseByNumber = async (pno)=>{
    const res = await api.get(`/purchases/number/${pno}`)
    return res.data;
}

export const getPurchaseBySupplier = async (sp) =>{
    const res = await api.get(`/purchases/supplier/${sp}`);
    return res.data;
}

export const createPurchase = async(payload)=>{
    const res = await api.post("/purchases",

        payload
    );

    return res.data;
}

export const cancelPurchase = async(id) =>{
    const res = await api.put(`/purchases/${id}/cancel`);
    return res.data;
}