import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Django 서버 URL로 수정
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 요청 인터셉터: 로컬 스토리지에 저장된 access 토큰을 자동으로 헤더에 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    // 만약 요청 URL이 회원가입 엔드포인트라면 토큰을 추가하지 않음
    if (config.url && config.url.includes('/accounts/api/signup/')) {
      return config;
    }
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default axiosInstance;
