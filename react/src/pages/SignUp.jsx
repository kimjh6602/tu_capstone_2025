import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';

function SignUp() {
  // 추가: 닉네임과 확인 비밀번호를 위한 상태 변수
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState(""); // 이메일을 username으로도 사용
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState(""); // 변수명을 password2로 변경

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // Django의 SignupSerializer가 요구하는 데이터 객체 구성
    axiosInstance.post('/accounts/api/signup/', {
      username: email,    // username 자리에 이메일 사용 (만약 별도의 username 입력이 필요하면 추가)
      email: email,
      nickname: nickname,
      password: password,
      password2: password2,
    })
    .then(response => {
      console.log("회원가입 성공:", response.data);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    })
    .catch(error => {
      console.error("회원가입 에러:", error.response?.data || error);
      alert("회원가입 중 오류가 발생했습니다. 입력 정보를 다시 확인해 주세요.");
    });
  };

  return (
    <div style={styles.container}>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* 닉네임 입력 필드 추가 */}
        <div style={styles.inputGroup}>
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            style={styles.input}
          />
        </div>
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
          <label htmlFor="password2">비밀번호 확인</label>
          <input 
            type="password" 
            id="password2" 
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
