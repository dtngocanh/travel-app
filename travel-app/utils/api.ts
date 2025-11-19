import axios from "axios";

const API_URL = "http://10.60.29.142:5001/api";

export const registerUser = (email: string, password: string) => {
  return axios.post(`${API_URL}/auth/register`, { email, password });
};