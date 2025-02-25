import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';

function SignUp() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate();

  // 이메일 중복 확인 함수
  const handleCheckEmail = async () => {
    try {
      const response = await axiosInstance.get('/accounts/emailcheck/', {
        params: { email }
      });
      const data = response.data;
      if (data.available == null) {
        setEmailValidated(false);
        alert("이메일을 입력하세요.");
      } else if (data.available) {
        setEmailValidated(true);
        alert("사용 가능한 이메일입니다.");
      } else {
        setEmailValidated(false);
        alert("이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      console.error("이메일 중복 검사 에러:", error);
      alert("이메일 중복 검사에 실패했습니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!emailValidated) {
      alert("이메일 중복 확인을 먼저 진행해주세요.");
      return;
    }

    // SignupSerializer가 요구하는 필드에 맞춰 데이터 전송
    axiosInstance.post('/accounts/api/signup/', {
      // 여기서는 이메일을 username으로도 사용 (필요에 따라 수정)
      username: email,
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
        {/* 닉네임 입력 */}
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
        {/* 이메일 입력 및 중복 확인 */}
        <div style={styles.inputGroup}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailValidated(false); // 이메일이 변경되면 검증 상태 초기화
            }}
            required
            style={styles.input}
          />
          <button
            type="button"
            onClick={handleCheckEmail}
            style={styles.checkButton}
            disabled={emailValidated}
          >
            {emailValidated ? "확인 완료" : "이메일 중복 확인"}
          </button>
        </div>
        {/* 비밀번호 입력 */}
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
        {/* 비밀번호 확인 입력 */}
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

export default SignUp;
