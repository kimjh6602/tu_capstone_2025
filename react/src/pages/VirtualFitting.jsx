import React, { useState } from 'react';
import axiosInstance from '../components/axiosInstance';

function VirtualFitting() {
  const [collections, setCollections] = useState([]);   // 서버에서 받아온 컬렉션 리스트
  const [selectedPalette, setSelectedPalette] = useState(null); // 메인에 보여줄 선택된 팔레트
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoadCollection = () => {
    setLoading(true);
    setError(null);
    axiosInstance
      .get('/palette/api/collection/')
      .then(response => {
        // [{ collection_id, palette_id, colors: [c1,c2,c3,c4] }, …]
        setCollections(response.data);
      })
      .catch(err => {
        console.error('컬렉션 불러오기 실패', err);
        setError('불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));
  };

  const NAVBAR_HEIGHT = 60;
  const styles = {
    page: {
      display: 'flex',
      height: '100vh',
      boxSizing: 'border-box'
    },
    main: {
      flex: 1,
      padding: '2rem',
      marginTop: NAVBAR_HEIGHT,
      overflowY: 'auto'
    },
    previewContainer: {
      marginBottom: '2rem',
      textAlign: 'center'
    },
    previewCard: {
      display: 'flex',
      width: '240px',
      margin: '0 auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    previewBlock: {
      flex: 1,
      height: '50px'
    },
    sidebar: {
      position: 'fixed',
      top: NAVBAR_HEIGHT,
      right: 0,
      bottom: 0,
      width: '220px',
      borderLeft: '1px solid #ddd',
      padding: '1rem',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      overflowY: 'auto',
      zIndex: 1000
    },
    loadButton: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      backgroundColor: '#2196F3',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    error: {
      color: 'red',
      fontSize: '0.9rem',
      marginBottom: '1rem'
    },
    cardList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    card: {
      border: '1px solid #ccc',
      borderRadius: '6px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer'
    },
    cardBlock: {
      height: '30px',
      width: '100%',
      borderBottom: '1px solid #eee',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={styles.page}>
      {/* 메인 */}
      <div style={styles.main}>
        {/* 선택된 팔레트 미리보기 */}
        <div style={styles.previewContainer}>
          <h2>선택된 팔레트</h2>
          {selectedPalette ? (
            <div style={styles.previewCard}>
              {selectedPalette.map((hex, i) => (
                <div key={i} style={{ ...styles.previewBlock, backgroundColor: hex }} />
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>사이드바에서 컬렉션을 클릭하세요.</p>
          )}
        </div>

        {/* 나머지 가상 피팅 UI */}
        <h1>가상 피팅</h1>
        <p>가상 피팅 기능을 통해 스타일링을 체험해보세요.</p>
      </div>

      {/* 사이드바 */}
      <div style={styles.sidebar}>
        <button
          onClick={handleLoadCollection}
          disabled={loading}
          style={styles.loadButton}
        >
          {loading ? '로딩 중…' : '컬렉션 불러오기'}
        </button>
        {error && <p style={styles.error}>{error}</p>}

        {collections.length === 0 && !loading && (
          <p style={{ fontSize: '0.9rem', color: '#666' }}>저장된 컬렉션이 없습니다.</p>
        )}
        <div style={styles.cardList}>
          {collections.map(item => (
            <div
              key={item.collection_id}
              style={styles.card}
              onClick={() => setSelectedPalette(item.colors)}
            >
              {item.colors.map((hex, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: hex,
                    ...styles.cardBlock
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualFitting;
