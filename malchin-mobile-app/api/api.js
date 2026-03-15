import axios from "axios";

// Backend серверийн хаяг (өөрийн IP-гээр солино)
const API = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
});

export default API;
