import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../components/axiosinstance'; // 파일 경로에 맞게 수정


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
   
    axiosInstance.post('/api/token/', {
      // Django TokenObtainPairView는 기본적으로 'username'과 'password'를 기대합니다.
      username: email, 
       // 만약 이메일을 username으로 사용하신다면 그대로 사용
      password: password,
    })
    
    .then(response => {
      const { access, refresh } = response.data;
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      // axiosInstance의 기본 헤더에 토큰을 추가 (인터셉터가 자동 적용되므로 선택적)
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${access}`;
      // 로그인 성공 시 홈으로 이동
      // 성공 시 콘솔에 토큰이 출력되는지 확인
      console.log("access token:", access);
      console.log("refresh token:", refresh);
      navigate("/");
    })

    .catch(error => {
      console.error("로그인 에러:", error);
      alert("로그인에 실패하였습니다. 입력 정보를 확인해 주세요.");
    });
  };

  return (
    <div style={styles.container}>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="email">이메일</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">비밀번호</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>로그인</button>
      </form>
      <p style={styles.linkText}>
        아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: 'auto'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  linkText: {
    marginTop: '15px',
    textAlign: 'center'
  }
};

export default Login;
