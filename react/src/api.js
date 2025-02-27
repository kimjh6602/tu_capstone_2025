import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";  // ✅ Django 서버 주소
// const API_URL = `${BASE_URL}/blog/api/posts/`;
const API_URL = "http://127.0.0.1:8000/blog/api/posts/";

export const fetchPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data.map(post => ({
    ...post,
    image: post.image ? `${BASE_URL}/media/${post.image}` : null  // ✅ 미디어 URL 명확하게 설정
  }));
};


// export async function fetchPosts() {
//   try {
//     const response = await fetch(API_URL);
//     if (!response.ok) {
//       throw new Error("Failed to fetch posts");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return [];
//   }
// }