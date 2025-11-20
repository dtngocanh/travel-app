import axios from "axios";

function getAllTours() {
  return axios.get(`http://192.168.1.26:5001/tours/`);
}

export { getAllTours};
