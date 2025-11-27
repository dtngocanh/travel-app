import axios from "axios";

const API_URL = "http://192.168.1.26:5001/api";

export const registerUser = (email: string, password: string) => {
  return axios.post(`${API_URL}/auth/register`, { email, password });
};

// Check or create user
// api.ts
export const checkOrCreateUser = (uid: string, email: string) => {
  return axios.post(`${API_URL}/users/check-or-create`, { uid, email }); // trùng backend route
};

export const getProfile = (idToken: string) => {
  return axios.get(`${API_URL}/users/profile-person`, {
    headers: {
      Authorization: `Bearer ${idToken}`, //  backend dùng firebaseAuth
    },
  });
};

// Update profile
export const updateProfile = (idToken: string, data: any) => {
  return axios.put(`${API_URL}/users/profile-person`, data, {
    headers: {
      Authorization: `Bearer ${idToken}`, // backend dùng firebaseAuth
    },
  });
};


// TOURS
export const getAllTours = () => axios.get(`${API_URL}/tours`);
export const getTourById = (id) => axios.get(`${API_URL}/tours/${id}`);
export const createPaymentIntent = (tourId) => axios.post(`${API_URL}/create-payment-intent`, { tourId });
