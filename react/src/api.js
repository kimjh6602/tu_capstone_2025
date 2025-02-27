import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";  // ✅ Django 서버 주소
const API_URL = `${BASE_URL}/blog/api/posts/`;
// const API_URL = "http://127.0.0.1:8000/blog/api/posts/";

export const fetchPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data.map(post => ({
    ...post,
    image: post.image ? `${BASE_URL}${post.image}` : null  // ✅ 절대 경로 변환
  }));
};

// export const fetchPosts = async () => {
//   const response = await axios.get(API_URL);
//   return response.data.map(post => ({
//     ...post,
//     image: post.image ? `${BASE_URL}/media/${post.image}` : null  // ✅ 미디어 URL 명확하게 설정
//   }));
// };