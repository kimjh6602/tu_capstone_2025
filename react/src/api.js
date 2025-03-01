import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; // ✅ Django 서버 주소
const API_URL = `${BASE_URL}/blog/api/posts/`;  // ✅ 정확한 URL 사용

const api = axios.create({
  baseURL: `${BASE_URL}/blog/api/posts/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;