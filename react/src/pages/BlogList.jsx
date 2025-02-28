import { useEffect, useState } from "react";
import "../styles/BlogList.css"; // ✅ 올바른 경로로 수정

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/posts/")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div className="container">
      <h1 className="title">📌 Latest Blog Posts</h1>
      <div className="blog-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="blog-card">
              {post.image && (
                <img src={post.image_url} alt={post.title} className="blog-image" />
              )}
              <div className="blog-content">
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-text">{post.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="loading">Loading...</p>
        )}
      </div>
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
//           <div key={post.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
//             <h2>{post.title}</h2>
//             {post.image_url ? (
//               <img 
//                 src={post.image_url} 
//                 alt={post.title} 
//                 style={{ width: "300px", height: "auto", borderRadius: "10px" }}
//               />
//             ) : (
//               <p>이미지가 없습니다.</p>
//             )}
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