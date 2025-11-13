import axios from "axios";

const API_URL = "http://192.168.1.19:5001/api";

export const registerUser = (email: string, password: string) => {
  return axios.post(`${API_URL}/auth/register`, { email, password });
};