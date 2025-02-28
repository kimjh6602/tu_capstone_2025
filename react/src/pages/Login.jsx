import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";

function Login() {
  const [username, setUsername] = useState(""); // ✅ username으로 변경
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ AuthContext에서 로그인 함수 가져옴

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post("/api/token/", {
        username: username, // ✅ Django 기본 인증은 username을 사용
        password: password,
      })
      .then((response) => {
        const { access, refresh } = response.data;

        // ✅ JWT 토큰을 localStorage에 저장
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        // ✅ AuthContext를 사용하여 로그인 상태 업데이트
        login(access, refresh);

        // ✅ 로그인 성공 후 메인 페이지로 이동
        navigate("/");
      })
      .catch((error) => {
        console.error("로그인 에러:", error);
        alert("로그인에 실패하였습니다. 입력 정보를 확인해 주세요.");
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <p>
        아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}

export default Login;



//지혁이 형 코드

// import React, { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axiosInstance from '../components/axiosInstance';
// import { AuthContext } from '../contexts/AuthContext';

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);  // AuthContext에서 login 함수를 가져옴

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axiosInstance.post('/api/token/', {
//       username: email,
//       password: password,
//     })
//     .then(response => {
//       const { access, refresh } = response.data;
//       // 토큰을 로컬스토리지에 저장
//       localStorage.setItem('access_token', access);
//       localStorage.setItem('refresh_token', refresh);
//       // AuthContext의 login 함수를 호출해서 전역 인증 상태 업데이트
//       login(access, refresh);
//       navigate("/");
//     })
//     .catch(error => {
//       console.error("로그인 에러:", error);
//       alert("로그인에 실패하였습니다. 입력 정보를 확인해 주세요.");
//     });
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
//       <h1>로그인</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="email">이메일</label>
//           <input 
//             type="email" 
//             id="email" 
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">비밀번호</label>
//           <input 
//             type="password" 
//             id="password" 
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">로그인</button>
//       </form>
//       <p>
//         아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
//       </p>
//     </div>
//   );
// }

// export default Login;
