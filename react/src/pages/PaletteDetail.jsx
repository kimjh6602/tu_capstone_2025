import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode'; // 2.2.0 버전 사용 권장
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const CopyableText = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy: ', err));
  };
  return (
    <div
      onClick={handleCopy}
      style={{
        cursor: 'pointer',
        position: 'relative',
        display: 'inline-block'
      }}
    >
      {text}
      {copied && (
        <span
          style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          Copied!
        </span>
      )}
    </div>
  );
};

const PaletteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [palette, setPalette] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map((char) => char + char).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  // JWT 토큰 디코딩 (2.2.0 버전 사용)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setCurrentUserId(decoded.user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // 팔레트 데이터 가져오기
  useEffect(() => {
    axiosInstance
      .get('/palette/api/detail/', { params: { id } })
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setPalette(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching palette:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!palette) return <div>No palette found.</div>;

  const colorKeys = ['color1', 'color2', 'color3', 'color4'];
  // palette 객체의 작성자 정보가 palette.user 라고 가정
  const isAuthor =
    palette.user && currentUserId &&
    palette.user.toString() === currentUserId.toString();

    const handleEdit = () => {
        navigate(`/palette/edit/${id}`, {
        state: {
            colors: [palette.color1, palette.color2, palette.color3, palette.color4],
            id: id,
        },
        });
    };
  const handleDelete = () => {
    if (window.confirm('정말로 이 팔레트를 삭제하시겠습니까?')) {
      axiosInstance
        .delete('/palette/api/detail/', { data: { id } })
        .then(() => {
          alert('팔레트가 삭제되었습니다.');
          navigate('/');
        })
        .catch((error) => {
          console.error('Error deleting palette:', error);
          alert('삭제에 실패하였습니다.');
        });
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '100px' }}>
      {/* 전체 레이아웃: 메인 콘텐츠와 오른쪽 사이드바 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {/* 메인 콘텐츠 영역 */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          {/* 팔레트 카드 */}
          <div
            className="palette-card"
            style={{
              width: '240px',
              margin: '40px auto',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <div
              className="palette-colors"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {colorKeys.map((key, index) => (
                <div
                  key={index}
                  className="palette-color"
                  style={{
                    backgroundColor: palette[key],
                    height: '50px'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* 정보 영역 */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <button style={{ marginRight: '10px', padding: '8px 16px' }}>
              Like Count: {palette.like_count ?? 0}
            </button>
            <button style={{ padding: '8px 16px' }}>
              Created: {dayjs(palette.created).fromNow()}
            </button>
          </div>

          {/* 색상 원 & 복사 기능 */}
          <div
            className="palette-circles"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              margin: '20px 0'
            }}
          >
            {colorKeys.map((key, index) => {
              const hex = palette[key];
              const rgb = hexToRgb(hex);
              return (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: hex,
                      margin: '0 auto'
                    }}
                  ></div>
                  <hr style={{ margin: '12px auto', width: '60%' }} />
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <CopyableText text={hex.toUpperCase()} />
                    </div>
                    <hr style={{ margin: '8px auto', width: '60%' }} />
                    <div>
                      <CopyableText text={rgb} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px' }}>
            <Link to="/">Back to Palette List</Link>
          </div>
        </div>
        {/* 오른쪽 사이드바 (항상 보임) */}
        <div
          style={{
            width: '80px',
            padding: '20px',
            borderLeft: '1px solid #ddd',
            textAlign: 'center'
          }}
        >
          {isAuthor ? (
            <>
              <button
                onClick={handleEdit}
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: '10px',
                  padding: '8px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                삭제
              </button>
            </>
          ) : (
            <p style={{ fontSize: '12px' }}>No Actions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaletteDetail;
