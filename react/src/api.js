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


// import axiosInstance from "./components/axiosInstance"; // ✅ JWT 포함된 axios 사용

// const BASE_URL = "http://127.0.0.1:8000";
// const API_URL = `${BASE_URL}/blog/api/posts/`;

// // ✅ 게시글 목록 가져오기 (JWT 포함)
// export const fetchPosts = async () => {
//   try {
//     const response = await axiosInstance.get(API_URL);
//     return response.data.map(post => ({
//       ...post,
//       image: post.image ? `${BASE_URL}${post.image}` : null // ✅ 절대 경로 변환 유지
//     }));
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     throw error;
//   }
// };

// // ✅ 새 글 작성 (JWT 포함)
// export const createPost = async (postData) => {
//   try {
//     const response = await axiosInstance.post(API_URL, postData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating post:", error);
//     throw error;
//   }
// };





// import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000";  // ✅ Django 서버 주소
// const API_URL = `${BASE_URL}/blog/api/posts/`;
// // const API_URL = "http://127.0.0.1:8000/blog/api/posts/";

// export const fetchPosts = async () => {
//   const response = await axios.get(API_URL);
//   return response.data.map(post => ({
//     ...post,
//     image: post.image ? `${BASE_URL}${post.image}` : null  // ✅ 절대 경로 변환
//   }));
// };