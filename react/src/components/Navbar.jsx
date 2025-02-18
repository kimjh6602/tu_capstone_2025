import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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
        <Link to="/login" style={styles.link}>로그인</Link>
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
    flexShrink: 0
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
  }
};

export default Navbar;
