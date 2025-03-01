import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.post('/api/token/', {
      username: email,
      password: password,
    })
      .then(response => {
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        login(access, refresh);
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
        아직 회원이 아니신가요? <Link to="/signup" style={styles.linkText}>회원가입</Link>
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
  checkButton: {
    marginTop: '5px',
    padding: '6px 10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
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
