import api from "./api";

export const login = async (data) => {
    const response = await api.post("/login", data);
    return response.data;
};

export const logout = async () => {
    const response = await api.post("/logout");
    return response.data;
};

export const profile = async () => {
    const response = await api.get("/profile");
    return response.data;
};

export const forgotPassword = async (data) => {
    return await api.post("/forgot-password", data);
};

export const resetPassword = async (data) => {
    return await api.post("/reset-password", data);
};