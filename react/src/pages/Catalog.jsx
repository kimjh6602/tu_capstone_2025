import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const App = () => {
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/palette/api/read/')
      .then(response => {
        setPalettes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('팔레트 데이터를 불러오는 중 에러 발생:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
        }
        /* 왼쪽 사이드바 스타일 */
        .sidebar {
          position: fixed;
          top: 60px;
          left: 0;
          width: 200px;
          height: calc(100% - 60px);
          background-color: #fff;
          border-right: 1px solid #ddd;
          padding: 1rem;
          box-sizing: border-box;
          z-index: 1;
        }
        .sidebar .search-container {
          margin-bottom: 1rem;
        }
        .sidebar input[type="text"] {
          width: 100%;
          padding: 0.5rem 0.5rem 0.5rem 2.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
          background: url('magnifying-glass-icon.png') no-repeat 8px center;
          background-size: 16px 16px;
        }
        .sidebar .buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar button {
          padding: 0.5rem;
          border: none;
          background-color: #333;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
        .sidebar button.add-button {
          margin-top: 1rem;
          background-color: #BBBBBB;
          font-weight: bold;
        }
        /* 메인 콘텐츠 영역 스타일 */
        .main-content {
          margin-top: 60px;
          margin-left: 220px;
          padding: 1rem;
        }
        /* 팔레트 카드 그리드: 한 줄에 4개 */
        .palette-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.7rem;
        }
        /* 카드 스타일 */
        .palette-card {
          width: 220px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        .palette-card:hover {
          transform: scale(1.03);
        }
        /* 색상 블록 영역: 수직 나열 */
        .palette-colors {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .palette-color {
          width: 100%;
          height: 50px;
          position: relative;
        }
        .palette-color:hover::after {
          content: attr(data-color);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0,0,0,0.6);
          color: #fff;
          padding: 5px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1;
        }
        /* 카드 푸터 영역 내부에 좋아요 버튼과 업로드 날짜 표시 */
        .palette-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background-color: #f2f2f2;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .like-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .like-button img {
          width: 16px;
          height: 16px;
        }
        .upload-date {
          font-size: 0.8rem;
          color: #333;
        }
        .like-count {
          font-size: 0.8rem;
          color: #333;
          margin-left: 0.3rem;
        }
        .no-data {
          padding: 2rem;
          text-align: center;
          font-size: 1.2rem;
          color: #666;
        }
      `}</style>
      {/* 왼쪽 사이드바 */}
      <div className="sidebar">
        <div className="search-container">
          <input type="text" placeholder="검색" />
        </div>
        <div className="buttons">
          <button>My Palette</button>
          <button>New</button>
          <button>Popular</button>
          <button>Collection</button>
          <Link to="/catalog/create">
            <button className="add-button">Add</button>
          </Link>
        </div>
      </div>
      {/* 메인 콘텐츠 영역 */}
      <div className="main-content">
        {loading ? (
          <div>팔레트를 불러오는 중...</div>
        ) : (
          <>
            {palettes.length === 0 ? (
              <div className="no-data">현재 저장된 팔레트가 없습니다.</div>
            ) : (
              <div className="palette-grid">
                {palettes.map(palette => (
                  <PaletteWithFooter
                    key={palette.id}
                    id={palette.id}
                    colors={[
                      palette.color1,
                      palette.color2,
                      palette.color3,
                      palette.color4
                    ]}
                    like={palette.like}
                    created={palette.created}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const PaletteWithFooter = ({ id, colors, like, created }) => {
  const [likeCount, setLikeCount] = useState(like);

  // GET 요청: 최신 좋아요 수를 쿼리 파라미터로 전달
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/palette/api/like/`, { params: { id: id } })
      .then(response => {
        setLikeCount(response.data.like);
      })
      .catch(error => console.error("Error fetching like:", error));
  }, [id]);

  const handleLike = () => {
    axios.patch(`http://127.0.0.1:8000/palette/api/like/`, { id: id })
         .then(response => {
            setLikeCount(response.data.like);
         })
         .catch(error => console.error("Error updating like:", error));
  };

  const formattedDate = new Date(created).toLocaleDateString();

  return (
    <div className="palette-card">
      <div className="palette-colors">
        {colors.map((color, idx) => (
          <div
            key={`${color}-${idx}`}
            className="palette-color"
            data-color={color}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="palette-footer">
        <button className="like-button" onClick={handleLike}>
          <img src="/heart-icon.png" alt="Like" />
        </button>
          <span className="like-count">{likeCount}</span>
          <span className="upload-date">{formattedDate}</span>
      </div>
    </div>
  );
};

export default App;
