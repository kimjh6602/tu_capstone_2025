import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import jwtDecode from "jwt-decode";
import "../styles/PostDetail.css";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [isLiked, setIsLiked] = useState(post?.current_user_liked || false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser({ id: decoded.user_id, username: decoded.username });
    }

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

  const handleLike = async () => {
    try {
      const response = await axiosInstance.post(`/blog/api/posts/${id}/like/`);
      setLikesCount(response.data.count);
      setIsLiked(response.data.status);
    } catch (error) {
      alert('좋아요 처리에 실패했습니다.');
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

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`/blog/api/comments/${commentId}/`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handleCommentEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  const handleCommentUpdate = async (commentId) => {
    try {
      const res = await axiosInstance.put(`/blog/api/comments/${commentId}/`, {
        content: editedCommentContent,
      });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: res.data.content } : c))
      );
      setEditingCommentId(null);
      setEditedCommentContent("");
    } catch (err) {
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentContent("");
  };

  const isAuthor = currentUser?.id === post?.author?.id;

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

              {isAuthor && (
                <div className="btn-container">
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>수정</button>
                  <button className="delete-btn" onClick={handleDelete}>삭제</button>
                  <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike} 
                  >
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  {likesCount}
                </button>
                </div>
              )}

              <button className="back-btn" onClick={() => navigate("/community")}>홈으로</button>

              {/* 댓글 */}
              <div className="comments-section">
                <h3>댓글</h3>
                {comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <p>
                      <strong>{comment.author?.username ?? "익명"}</strong> |{" "}
                      {new Date(comment.created_at).toLocaleString()}
                    </p>

                    {editingCommentId === comment.id ? (
                      <>
                        <textarea
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                          className="comment-edit-textarea"
                        />
                        <div className="comment-edit-btns">
                          <button onClick={() => handleCommentUpdate(comment.id)}>저장</button>
                          <button onClick={cancelEdit}>취소</button>
                        </div>
                      </>
                    ) : (
                      <p>{comment.content}</p>
                    )}

                    {currentUser?.id === comment.author?.id && editingCommentId !== comment.id && (
                      <div className="comment-actions">
                        <button onClick={() => handleCommentEdit(comment)}>수정</button>
                        <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
                      </div>
                    )}
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