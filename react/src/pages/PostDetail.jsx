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
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({ title: "", content: "" });

  useEffect(() => {
    axiosInstance
      .get(`/blog/api/posts/${id}/`)
      .then((res) => {
        setPost(res.data);
        setEditPost({ title: res.data.title, content: res.data.content });
      })
      .catch(() => setError("게시글을 불러오는 데 실패했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  // 수정 폼 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPost((prev) => ({ ...prev, [name]: value }));
  };

  // 게시글 수정 요청
  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/blog/api/posts/${id}/`, editPost);
      setPost({ ...post, ...editPost });
      setIsEditing(false);
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
    }
  };

  // 게시글 삭제 요청
  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/blog/api/posts/${id}/`);
        alert("게시글이 삭제되었습니다.");
        navigate("/community"); // 삭제 후 커뮤니티 홈으로 이동
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="post-detail-container">
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="post-detail">
          {isEditing ? (
            // 수정 폼 UI
            <div className="edit-form">
              <input
                type="text"
                name="title"
                value={editPost.title}
                onChange={handleChange}
                className="edit-input"
              />
              <textarea
                name="content"
                value={editPost.content}
                onChange={handleChange}
                className="edit-textarea"
              />
              <button className="save-btn" onClick={handleUpdate}>저장</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
            </div>
          ) : (
            // 게시글 상세 UI
            <>
              <h1>{post.title}</h1>
              <p className="author">작성자: {post.author?.username || "알 수 없음"}</p>
              <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>
              <p>수정 시간: {new Date(post.updated_at).toLocaleString()}</p>
              {post.image && <img src={post.image} alt={post.title} className="post-image" />}
              <p>{post.content}</p>

              {/* 버튼 추가 */}
              <button className="edit-btn" onClick={() => setIsEditing(true)}>수정</button>
              <button className="delete-btn" onClick={handleDelete}>삭제</button>
              <button className="back-btn" onClick={() => navigate("/community")}>커뮤니티 홈으로</button>
            </>
          )}
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
//       .catch(() => setError("게시글을 불러오는 데 실패했습니다."))
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
//           {/* 수정: community로 이동 */}
//           <button className="back-btn" onClick={() => navigate("/community")}>목록으로 돌아가기</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostDetail;