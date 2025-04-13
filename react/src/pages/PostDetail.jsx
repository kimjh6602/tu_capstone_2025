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
  const [editPost, setEditPost] = useState({ title: "", content: "", images: [] });
  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await axiosInstance.get(`/blog/api/posts/${id}/`);
        setPost(postRes.data);
        setEditPost({
          title: postRes.data.title,
          content: postRes.data.content,
          images: [],
        });
        if (postRes.data.images.length > 0) {
          setPreviewImage(postRes.data.images[0].image_url);
        }

        const commentRes = await axiosInstance.get(`/blog/api/posts/${id}/comments/`);
        setComments(commentRes.data);
      } catch (err) {
        setError("게시글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditPost((prev) => ({ ...prev, images: files }));
    setPreviewImage(URL.createObjectURL(files[0]));
    setFileName(files[0].name);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editPost.title);
      formData.append("content", editPost.content);
      editPost.images.forEach((image) => formData.append("images", image));

      const response = await axiosInstance.put(`/blog/api/posts/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPost(response.data);
      setIsEditing(false);
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/blog/api/posts/${id}/`);
        alert("게시글이 삭제되었습니다.");
        navigate("/community");
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/blog/api/posts/${id}/comments/`, {
        content: newComment,
      });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="post-detail-container">
      {loading || !post ? (
        <p className="loading-text">로딩 중...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="post-detail">
          {isEditing ? (
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
              {previewImage && (
                <img src={previewImage} alt="Preview" className="preview-image" />
              )}
              <label className="edit-file-label">
                이미지 선택
                <input
                  type="file"
                  name="images"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="edit-file"
                />
              </label>
              {fileName && <p className="selected-file-name">{fileName}</p>}

              <div className="btn-container">
                <button className="save-btn" onClick={handleUpdate}>저장</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="post-title">{post?.title}</h1>
              <p className="post-meta">
                <span className="author">
                  작성자: {post?.author?.username ?? "알 수 없음"}
                </span>
                <br />
                작성 시간: {new Date(post?.created_at).toLocaleString()}
                <br />
                수정 시간: {new Date(post?.updated_at).toLocaleString()}
              </p>

              {post?.images?.map((img) => (
                <img key={img.id} src={img.image_url} alt="post" className="post-image" />
              ))}

              <p className="post-content">{post?.content}</p>

              <div className="btn-container">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>수정</button>
                <button className="delete-btn" onClick={handleDelete}>삭제</button>
                <button className="back-btn" onClick={() => navigate("/community")}>홈으로</button>
              </div>

              {/* 댓글 */}
              <div className="comments-section">
                <h3>댓글</h3>
                {comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <p>
                      <strong>{comment.author?.username ?? "익명"}</strong> |{" "}
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                    <p>{comment.content}</p>
                  </div>
                ))}

                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    required
                  />
                  <button type="submit">댓글 작성</button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetail;