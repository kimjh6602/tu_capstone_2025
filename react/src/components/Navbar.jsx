import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    axiosInstance.post('/api/logout/', { refresh_token: refreshToken })
      .then(() => {
        logout(); // AuthContext의 logout 함수 호출
        navigate('/');
      })
      .catch((error) => {
        console.error('로그아웃 오류:', error);
        logout();
        navigate('/');
      });
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <ul style={styles.ul}>
          <li style={styles.li}><Link to="/" style={styles.link}>홈</Link></li>
          <li style={styles.li}><Link to="/clothing-generator" style={styles.link}>의류 생성</Link></li>
          <li style={styles.li}><Link to="/virtual-fitting" style={styles.link}>가상 피팅</Link></li>
          <li style={styles.li}><Link to="/catalog" style={styles.link}>카탈로그</Link></li>
          <li style={styles.li}><Link to="/community" style={styles.link}>커뮤니티</Link></li>
        </ul>
      </div>
      <div style={styles.right}>
        {isAuthenticated ? (
          <>
            <Link to="/mypage" style={{ ...styles.link, marginRight: '15px' }}>마이페이지</Link>
            <button onClick={handleLogout} style={styles.button}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>로그인</Link>
            <Link to="/signup" style={{ ...styles.link, marginLeft: '15px' }}>회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#333',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  left: {
    flex: 1
  },
  right: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center'
  },
  ul: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  li: {
    marginRight: '15px'
  },
  link: {
    color: '#fff',
    textDecoration: 'none'
  },
  button: {
    backgroundColor: '#fff',
    color: '#333',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default Navbar;
