import axios from "axios";

// http://13.61.183.31:4000/api 
const api = axios.create({
  baseURL: "http://13.61.183.31:4000/api/",
});

export default api;
