import axios from "axios";

function getAllTours() {
  return axios.get(`http://10.60.29.142:5001/tours/`);
}

export { getAllTours};
