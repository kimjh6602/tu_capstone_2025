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
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("🚨 No access token found!");
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



// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8000', // Django 서버 URL로 수정
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
// });

// // 요청 인터셉터: 로컬 스토리지에 저장된 access 토큰을 자동으로 헤더에 첨부
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // 만약 요청 URL이 회원가입 엔드포인트라면 토큰을 추가하지 않음
//     if (config.url && config.url.includes('/accounts/api/signup/')) {
//       return config;
//     }
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// export default axiosInstance;
