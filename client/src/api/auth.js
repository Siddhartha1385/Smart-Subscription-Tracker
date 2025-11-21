import api from "./axios";

export const loginApi = async ({ email, password }) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    // Throw a standardized error object for the Context to catch
    throw error;
  }
};

export const registerApi = async ({ name, email, password }) => {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  } catch (error) {
    throw error;
  }
};