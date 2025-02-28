import { useEffect, useState } from "react"; 

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/posts/")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            <h2>{post.title}</h2>
            {post.image_url ? (
              <img 
                src={post.image_url} 
                alt={post.title} 
                style={{ width: "300px", height: "auto", borderRadius: "10px" }}
              />
            ) : (
              <p>이미지가 없습니다.</p>
            )}
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BlogList;

// import { useEffect, useState } from "react";

// const BlogList = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/posts/")
//       .then((res) => res.json())
//       .then((data) => setPosts(data))
//       .catch((error) => console.error("Error fetching posts:", error));
//   }, []);

//   return (
//     <div>
//       {posts.length > 0 ? (
//         posts.map((post) => (
//           <div key={post.id}>
//             <h2>{post.title}</h2>
//             {post.image && <img src={`http://127.0.0.1:8000${post.image}`} alt={post.title} />}
//             <p>{post.content}</p>
//           </div>
//         ))
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };



// export default BlogList;



// import React, { useEffect, useState } from "react";
// import { fetchPosts } from "../api";
// import "../styles/BlogList.css";

// const BlogList = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetchPosts().then((data) => setPosts(data));
//   }, []);

//   return (
//     <div className="blog-container">
//       <h1 className="title">커뮤니티</h1>
//       <p className="description">패션에 관한 다양한 이야기와 소식을 나눌 수 있습니다.</p>
//       <div className="blog-list">
//         {posts.map((post) => (
//           <div key={post.id} className="blog-card">
//             <h2 className="blog-title">{post.title}</h2>
//             {post.image && (
//               <img
//                 src={post.image}  // ✅ Django에서 절대 경로 제공
//                 alt={post.title}
//                 className="blog-image"
//               />
//             )}
//             <p className="blog-content">{post.content}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const getImageUrl = (image) => {
//   if (!image) return null;
//   return image.startsWith("http") ? image : `http://localhost:8000${image}`;
// };

// <img src={getImageUrl(post.image)} alt={post.title} className="blog-image" />


// export default BlogList;