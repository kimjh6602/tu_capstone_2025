import React from 'react';

function Catalog() {
  return (
    <div style={styles.container}>
      <h1>의류 카탈로그</h1>
      <p>다양한 의류 아이템을 살펴보세요.</p>
      {/* 카탈로그 데이터를 불러와서 보여주는 컴포넌트 추가 */}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px'
  }
};

export default Catalog;
