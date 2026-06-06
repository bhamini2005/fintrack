import axios from "axios";

const API = axios.create({
  baseURL: "https://fintrack-backend-z5mj.onrender.com/api",
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  console.log("HEADERS:", req.headers);

  return req;
});

export default API;
