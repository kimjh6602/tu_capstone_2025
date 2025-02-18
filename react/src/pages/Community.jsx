import React from 'react';

function Community() {
  return (
    <div style={styles.container}>
      <h1>커뮤니티</h1>
      <p>패션에 관한 다양한 이야기와 소식을 나눌 수 있습니다.</p>
      {/* 커뮤니티 기능 (게시판, 댓글 등) 추가 */}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px'
  }
};

export default Community;
