import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 로그인 API 호출 로직 추가 (예: Django 백엔드와 통신)
    console.log("로그인 시도:", email, password);
    // 로그인 성공 시 홈으로 이동 (예시)
    navigate("/");
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
