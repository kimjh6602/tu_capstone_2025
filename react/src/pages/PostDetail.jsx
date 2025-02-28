import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import "../styles/PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/blog/api/posts/${id}/`)
      .then((res) => setPost(res.data))
      .catch((error) => setError("게시글을 불러오는 데 실패했습니다."))
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
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <p className="author">작성자: {post.author?.username || "알 수 없음"}</p>
            <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>
            <p>수정 시간: {new Date(post.updated_at).toLocaleString()}</p>
          </div>
          {post.image && <img src={post.image} alt={post.title} className="post-image" />}
          <p className="post-content">{post.content}</p>
        </div>
      )}
    </div>
  );
};

export default PostDetail;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../components/axiosInstance";
// import "../styles/PostDetail.css";

// const PostDetail = () => {
//   const { id } = useParams();
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
//           <p>작성자: {post.author}</p>
//           <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>
//           <p>수정 시간: {new Date(post.updated_at).toLocaleString()}</p>
//           {post.image && <img src={post.image} alt={post.title} />}
//           <p>{post.content}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostDetail;
