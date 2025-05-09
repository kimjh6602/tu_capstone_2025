import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import "../styles/BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", images: [] });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/blog/api/posts/")
      .then((res) => setPosts(res.data))
      .catch(() => setError("게시글을 불러오는 데 실패했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewPost((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("content", newPost.content);
    newPost.images.forEach((image) => formData.append("images", image));

    try {
      const res = await axiosInstance.post("/blog/api/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts([res.data, ...posts]);
      setNewPost({ title: "", content: "", images: [] });
      setShowForm(false);
    } catch {
      setError("게시글을 작성하는 데 실패했습니다.");
    }
  };

  return (
    <div className="blog-container">
      <button className="create-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "취소" : "새 글 작성하기"}
      </button>

      {showForm && (
        <form className="post-form" onSubmit={handleSubmit}>
          <input type="text" name="title" value={newPost.title} onChange={handleChange} placeholder="제목" required className="styled-input"/>
          <textarea name="content" value={newPost.content} onChange={handleChange} placeholder="내용" required className="styled-textarea"/>
          <input type="file" name="images" onChange={handleFileChange} accept="image/*" multiple className="styled-file"/>
          <button type="submit" className="submit-btn">작성</button>
        </form>
      )}

      <div className="post-list">
        {loading ? (
          <p>게시글을 불러오는 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
              <h2>{post.title}</h2>
              <p className="post-meta">
                {post.author?.username || "알 수 없음"}   |   {new Date(post.created_at).toLocaleDateString()}
                <span> ❤️ {post.likes_count}</span> 
              </p>

              {post.images && post.images.length > 0 && (
                <img
                className="blog-image"
                src={post.images[0].image_url}
                />
              )}
              <div className="truncate-multiline">
              
              
              <p>{post.content}</p>
            </div>
            </div>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;