import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import "../styles/PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/blog/api/posts/${id}/`)
      .then((res) => setPost(res.data))
      .catch(() => setError("게시글을 불러오는 데 실패했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="post-detail-container">
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="post-detail">
          <h1>{post.title}</h1>
          <p className="author">작성자: {post.author?.username || "알 수 없음"}</p>
          <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>
          <p>수정 시간: {new Date(post.updated_at).toLocaleString()}</p>
          {post.image && <img src={post.image} alt={post.title} className="post-image" />}
          <p>{post.content}</p>
          {/* 수정: community로 이동 */}
          <button className="back-btn" onClick={() => navigate("/community")}>목록으로 돌아가기</button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;



// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../components/axiosInstance";
// import "../styles/PostDetail.css";

// const PostDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axiosInstance
//       .get(`/blog/api/posts/${id}/`)
//       .then((res) => setPost(res.data))
//       .catch((error) => setError("게시글을 불러오는 데 실패했습니다."))
//       .finally(() => setLoading(false));
//   }, [id]);

//   return (
//     <div className="post-detail-container">
//       {loading ? (
//         <p>로딩 중...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <div className="post-detail">
//           <h1>{post.title}</h1>
//           <p className="author">작성자: {post.author?.username || "알 수 없음"}</p>
//           <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>
//           <p>수정 시간: {new Date(post.updated_at).toLocaleString()}</p>
//           {post.image && <img src={post.image} alt={post.title} className="post-image" />}
//           <p>{post.content}</p>
//           <button className="back-btn" onClick={() => navigate("/")}>홈으로 돌아가기</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostDetail;