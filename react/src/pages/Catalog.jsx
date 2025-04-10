import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const App = () => {
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('new'); // 기본 필터: new (최신순)

  // 백엔드 API 호출 함수: 필터에 따라 쿼리 파라미터 전달
  const fetchPalettes = (filterValue) => {
    setLoading(true);
    let params = {};
    const token = localStorage.getItem("access_token");
    if (filterValue === 'new') {
      params.ordering = '-created';
    } else if (filterValue === 'popular') {
      params.ordering = '-like';
    } else if (filterValue === 'mypalette') {
      if (token) {
        params.ordering = '-mypalette';
      }
    } else if (filterValue === 'collection') {
      if (token) {
        params.ordering = '-collection';
      }
    }
    axiosInstance.get('/palette/api/read/', { params })
      .then(response => {
        setPalettes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('팔레트 데이터를 불러오는 중 에러 발생:', error);
        setLoading(false);
      });
  };

  // 필터 변경 시 데이터 재호출
  useEffect(() => {
    fetchPalettes(filter);
  }, [filter]);

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
        .sidebar button.active {
          background-color: #BBBBBB;
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
          cursor: pointer;
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
        /* 카드 푸터 영역 */
        .palette-footer {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.2rem;
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
        .like-count {
          font-size: 0.8rem;
          color: #333;
          margin-left: 0.1rem;
        }
        .upload-date {
          font-size: 0.8rem;
          color: #333;
          margin-left: auto;
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
          <button className={filter === 'new' ? 'active' : ''} onClick={() => setFilter('new')}>
            New
          </button>
          <button className={filter === 'mypalette' ? 'active' : ''} onClick={() => setFilter('mypalette')}>
            My Palette
          </button>
          <button className={filter === 'popular' ? 'active' : ''} onClick={() => setFilter('popular')}>
            Popular
          </button>
          <button className={filter === 'collection' ? 'active' : ''} onClick={() => setFilter('collection')}>
            Collection
          </button>
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
                    colors={[palette.color1, palette.color2, palette.color3, palette.color4]}
                    like={palette.like_count}
                    liked={palette.liked}
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

const PaletteWithFooter = ({ id, colors, like, liked, created }) => {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(like);
  const [localLiked, setLocalLiked] = useState(liked);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axiosInstance
      .get('/palette/api/like/', { params: { id: id } })
      .then(response => {
        setLikeCount(response.data.like);
      })
      .catch(error => console.error("Error fetching like:", error));
  }, [id, refresh]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!localLiked) {
      axiosInstance
        .post('/palette/api/like/', { id: id })
        .then(response => {
          console.log("Like updated response:", response.data);
          setLocalLiked(true);
          setRefresh(prev => prev + 1);
        })
        .catch(error => console.error("Error updating like:", error));
    } else {
      axiosInstance
        .delete('/palette/api/like/', { data: { id: id } })
        .then(response => {
          console.log("Like updated response:", response.data);
          setLocalLiked(false);
          setRefresh(prev => prev + 1);
        })
        .catch(error => console.error("Error deleting like:", error));
    }
  };

  const handleCardClick = () => {
    navigate(`/palette/${id}`);
  };

  const formattedDate = dayjs(created).fromNow();

  return (
    <div className="palette-card" onClick={handleCardClick}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button className="like-button" onClick={handleLike} style={{ padding: 0 }}>
            {localLiked ? (
              <i className="ri-heart-fill" style={{ color: 'black' }}></i>
            ) : (
              <i className="ri-heart-line"></i>
            )}
          </button>
          <span className="like-count" style={{ fontSize: '0.8rem' }}>{likeCount}</span>
        </div>
        <span className="upload-date" style={{ fontSize: '0.8rem', marginLeft: 'auto' }}>
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default App;
