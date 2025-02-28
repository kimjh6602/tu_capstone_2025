import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import "../styles/BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null });
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
    setNewPost((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("content", newPost.content);
    if (newPost.image) {
      formData.append("image", newPost.image);
    }

    try {
      const res = await axiosInstance.post("/blog/api/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts([res.data, ...posts]);
      setNewPost({ title: "", content: "", image: null });
      setShowForm(false);
    } catch {
      setError("게시글을 작성하는 데 실패했습니다.");
    }
  };

  return (
    <div className="blog-container">
      <h1 className="title">블로그</h1>

      <button className="create-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "취소" : "새 글 작성하기"}
      </button>

      {showForm && (
        <form className="post-form" onSubmit={handleSubmit}>
          <input type="text" name="title" value={newPost.title} onChange={handleChange} placeholder="제목" required className="styled-input"/>
          <textarea name="content" value={newPost.content} onChange={handleChange} placeholder="내용" required className="styled-textarea"/>
          <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="styled-file"/>
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
              {post.image && <img src={post.image} alt={post.title} className="blog-image" />}
              <p>{post.content}</p>
              <p className="author">작성자: {post.author?.username || "알 수 없음"}</p>
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



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../components/axiosInstance"; // ✅ JWT 포함된 axios 인스턴스 사용
// import "../styles/BlogList.css";

// const BlogList = () => {
//   const [posts, setPosts] = useState([]);
//   const [newPost, setNewPost] = useState({ title: "", content: "", image: null });
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // ✅ 페이지 이동을 위한 훅

//   // ✅ 게시글 목록 가져오기
//   useEffect(() => {
//     axiosInstance
//       .get("/blog/api/posts/")
//       .then((res) => {
//         console.log("✅ 서버 응답:", res.data);
//         setPosts(res.data);
//       })
//       .catch((error) => {
//         console.error("📌 게시글 불러오기 실패:", error);
//         setError("게시글을 불러오는 데 실패했습니다.");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   // ✅ 입력 값 변경 처리
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewPost((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ 이미지 파일 처리
//   const handleFileChange = (e) => {
//     setNewPost((prev) => ({ ...prev, image: e.target.files[0] }));
//   };

//   // ✅ 새 글 추가 요청
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("title", newPost.title);
//     formData.append("content", newPost.content);
//     if (newPost.image) {
//       formData.append("image", newPost.image);
//     }

//     try {
//       const res = await axiosInstance.post("/blog/api/posts/", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setPosts([res.data, ...posts]); // ✅ 새 글을 즉시 목록에 반영
//       setNewPost({ title: "", content: "", image: null }); // ✅ 입력 폼 초기화
//       setShowForm(false); // ✅ 폼 닫기
//     } catch (error) {
//       console.error("📌 게시글 작성 실패:", error);
//       setError("게시글을 작성하는 데 실패했습니다.");
//     }
//   };

//   return (
//     <div className="blog-container">
//       <h1 className="title">블로그</h1>

//       {/* ✅ "새 글 작성하기" 버튼 */}
//       <button className="create-btn" onClick={() => setShowForm(!showForm)}>
//         {showForm ? "취소" : "새 글 작성하기"}
//       </button>

//       {/* ✅ 새 글 작성 폼 */}
//       {showForm && (
//         <form className="post-form" onSubmit={handleSubmit}>
//           <input type="text" name="title" value={newPost.title} onChange={handleChange} placeholder="제목을 입력하세요" required />
//           <textarea name="content" value={newPost.content} onChange={handleChange} placeholder="내용을 입력하세요" required />
//           <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
//           <button type="submit">작성</button>
//         </form>
//       )}

//       {/* ✅ 게시글 목록 */}
//       <div className="post-list">
//         {loading ? (
//           <p>게시글을 불러오는 중...</p>
//         ) : error ? (
//           <p>{error}</p>
//         ) : posts.length > 0 ? (
//           posts.map((post) => (
//             <div key={post.id} className="post-card" onClick={() => navigate(`/blog/${post.id}`)}>
//               <h2>{post.title}</h2>
//               {post.image && <img src={post.image} alt={post.title} />}
//               <p>{post.content}</p>
//             </div>
//           ))
//         ) : (
//           <p>게시글이 없습니다.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlogList;