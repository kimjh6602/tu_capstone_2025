import React from 'react';

function Home() {
  return (
    <div style={styles.container}>
      <h1>패션 웹사이트에 오신 것을 환영합니다</h1>
      <p>최신 인공지능 기술을 활용한 의류 생성 및 편집 서비스를 제공합니다.</p>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px'
  }
};

export default Home;
