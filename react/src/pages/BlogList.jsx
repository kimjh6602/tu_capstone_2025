import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api";
import "../styles/BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then((data) => setPosts(data));
  }, []);

  return (
    <div className="blog-container">
      <h1 className="title">커뮤니티</h1>
      <p className="description">패션에 관한 다양한 이야기와 소식을 나눌 수 있습니다.</p>
      <div className="blog-list">
        {posts.map((post) => (
          <div key={post.id} className="blog-card">
            <h2 className="blog-title">{post.title}</h2>
            {post.image && (
              <img
                src={post.image}  // ✅ Django에서 절대 경로 제공
                alt={post.title}
                className="blog-image"
              />
            )}
            <p className="blog-content">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;