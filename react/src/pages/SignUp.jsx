import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 여기에 실제 회원가입 API 호출 로직 추가 (예: Django 백엔드와 통신)
    console.log("회원가입 시도:", email, password);
    // 회원가입 성공 후 로그인 페이지로 이동
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h1>회원가입</h1>
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
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>회원가입</button>
      </form>
      <p style={styles.linkText}>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
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

export default SignUp;
