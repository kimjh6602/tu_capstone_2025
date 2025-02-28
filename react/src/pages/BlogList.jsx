import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance"; // ✅ JWT 포함된 axios 인스턴스 사용
import "../styles/BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 게시글 목록 가져오기 (JWT 인증 포함)
  useEffect(() => {
    axiosInstance
      .get("/blog/api/posts/")
      .then((res) => {
        console.log("✅ 서버 응답:", res.data); // 디버깅 로그
        setPosts(res.data);
      })
      .catch((error) => {
        console.error("📌 게시글 불러오기 실패:", error);
        setError("게시글을 불러오는 데 실패했습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ 입력 값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 이미지 파일 처리
  const handleFileChange = (e) => {
    setNewPost((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // ✅ 새 글 추가 요청 (JWT 포함)
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
      setPosts([res.data, ...posts]); // ✅ 새 글을 즉시 목록에 반영
      setNewPost({ title: "", content: "", image: null }); // ✅ 입력 폼 초기화
      setShowForm(false); // ✅ 작성 후 폼 닫기
    } catch (error) {
      console.error("📌 게시글 작성 실패:", error);
      setError("게시글을 작성하는 데 실패했습니다.");
    }
  };

  return (
    <div className="blog-container">
      <h1 className="title">블로그</h1>

      {/* ✅ "새 글 작성하기" 버튼 */}
      <button className="create-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "취소" : "새 글 작성하기"}
      </button>

      {/* ✅ 글 작성 폼 (토글 가능) */}
      {showForm && (
        <form className="post-form" onSubmit={handleSubmit}>
          <input type="text" name="title" value={newPost.title} onChange={handleChange} placeholder="제목" required />
          <textarea name="content" value={newPost.content} onChange={handleChange} placeholder="내용" required />
          <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
          <button type="submit">작성</button>
        </form>
      )}

      {/* ✅ 게시글 목록 */}
      <div className="post-list">
        {loading ? (
          <p className="loading">게시글을 불러오는 중...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <h2 className="blog-title">{post.title}</h2>

              {/* ✅ 이미지가 있을 때만 렌더링 */}
              {post.image && (
                <div className="image-container">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="blog-image"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              <p className="blog-text">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="loading">게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;


// import { useEffect, useState } from "react";
// import axiosInstance from "../components/axiosInstance"; // ✅ JWT 포함된 axios 인스턴스 사용
// import "../styles/BlogList.css";

// const BlogList = () => {
//   const [posts, setPosts] = useState([]);
//   const [newPost, setNewPost] = useState({ title: "", content: "", image: null });
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const BASE_URL = "http://127.0.0.1:8000"; // ✅ Django 서버 주소

//   // ✅ 게시글 목록 가져오기 (JWT 인증 포함)
//   useEffect(() => {
//     axiosInstance
//       .get("/blog/api/posts/")
//       .then((res) => {
//         console.log("✅ 서버 응답:", res.data); // 디버깅 로그
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

//   // ✅ 새 글 추가 요청 (JWT 포함)
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
//       setShowForm(false); // ✅ 작성 후 폼 닫기
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

//       {/* ✅ 글 작성 폼 (토글 가능) */}
//       {showForm && (
//         <form className="post-form" onSubmit={handleSubmit}>
//           <input type="text" name="title" value={newPost.title} onChange={handleChange} placeholder="제목" required />
//           <textarea name="content" value={newPost.content} onChange={handleChange} placeholder="내용" required />
//           <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
//           <button type="submit">작성</button>
//         </form>
//       )}

//       {/* ✅ 게시글 목록 */}
//       <div className="post-list">
//         {loading ? (
//           <p className="loading">게시글을 불러오는 중...</p>
//         ) : error ? (
//           <p className="error-message">{error}</p>
//         ) : posts.length > 0 ? (
//           posts.map((post) => (
//             <div key={post.id} className="post-card">
//               <h2 className="blog-title">{post.title}</h2>
//               <div className="image-container">
//                 {post.image ? (
//                   <img src={post.image} alt={post.title} className="blog-image" onError={(e) => e.target.style.display = 'none'} />
//                 ) : (
//                   <div className="placeholder-image">이미지 없음</div>
//                 )}
//               </div>
//               <p className="blog-text">{post.content}</p>
//             </div>
//           ))
//         ) : (
//           <p className="loading">게시글이 없습니다.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlogList;