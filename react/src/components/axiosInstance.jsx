import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// 요청 인터셉터: 요청을 보낼 때 access 토큰을 자동으로 포함
axiosInstance.interceptors.request.use(
  (config) => {


    //modified from Github
     const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;

    } else {
      //console.warn("🚨 No access token found!");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 오류 발생 시 자동으로 로그아웃 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error("🚨 401 Unauthorized - Logging out...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login"; // 로그인 페이지로 이동
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;