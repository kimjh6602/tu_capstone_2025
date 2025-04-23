import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';
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
      .catch(console.error);
  };
  return (
    <div onClick={handleCopy} style={{ cursor:'pointer', position:'relative', display:'inline-block' }}>
      {text}
      {copied && <span style={{
        position:'absolute', top:'-20px', left:'50%',
        transform:'translateX(-50%)',
        background:'rgba(0,0,0,0.75)', color:'#fff',
        padding:'2px 6px', borderRadius:4, fontSize:12
      }}>Copied!</span>}
    </div>
  );
};

export default function PaletteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [palette, setPalette] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [userId, setUserId]     = useState(null);
  const [saved, setSaved]       = useState(false);
  const [busy, setBusy]         = useState(false);

  // 헥사 → RGB
  const hexToRgb = hex => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
    const v = parseInt(hex,16);
    return `rgb(${(v>>16)&255}, ${(v>>8)&255}, ${v&255})`;
  };

  // 1) JWT에서 user_id 추출
  useEffect(()=>{
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const { user_id } = jwt_decode(token);
        setUserId(user_id);
      } catch(e){
        console.error('JWT decode error', e);
      }
    }
  },[]);

  // 2) 상세 + 저장상태 동시에 불러오기
  useEffect(()=>{
    setLoading(true);
    Promise.all([
      axiosInstance.get('/palette/api/detail/', { params: { id } }),
      axiosInstance.get('/palette/api/collection/status/', { params: { palette_id: id } })
    ])
    .then(([resPal, resStat])=>{
      const data = Array.isArray(resPal.data) ? resPal.data[0] : resPal.data;
      setPalette(data);
      setSaved(resStat.data.saved);
    })
    .catch(err=> console.error(err))
    .finally(()=> setLoading(false));
  },[id]);

  if (loading) return <div>Loading...</div>;
  if (!palette) return <div>No palette found.</div>;

  const colorKeys = ['color1','color2','color3','color4'];
  const isAuthor = palette.user?.toString() === userId?.toString();

  const handleEdit = () => {
    navigate(`/palette/edit/${id}`, {
      state: {
        colors: colorKeys.map(k=>palette[k]),
        id
      }
    });
  };
  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    axiosInstance.delete('/palette/api/detail/', { data:{ id } })
      .then(()=> { alert('삭제되었습니다'); navigate('/catalog'); })
      .catch(console.error);
  };
  const handleCollection = e => {
    e.stopPropagation();
    if (!userId) {
      alert('로그인 후 이용해주세요');
      return navigate('/login');
    }
    if (saved) return; // 이미 저장된 상태면 무시
    setBusy(true);
    axiosInstance.post('/palette/api/collection/', { palette_id: id })
      .then(()=> setSaved(true))
      .catch(err=>{
        if (err.response?.status===400) {
          // 중복 저장 시에도 saved = true
          setSaved(true);
        } else {
          console.error(err);
          alert('오류 발생');
        }
      })
      .finally(()=> setBusy(false));
  };

  return (
    <div style={{ padding:20, marginTop:100 }}>
      <div style={{ display:'flex', justifyContent:'center', gap:20 }}>
        {/* 메인 */}
        <div style={{ flex:1, textAlign:'center' }}>
          {/* 팔레트 카드 */}
          <div style={{
            width:240, margin:'40px auto',
            border:'1px solid #ddd', borderRadius:8,
            overflow:'hidden', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {colorKeys.map((k,i)=>(
                <div key={i} style={{
                  backgroundColor:palette[k], height:50
                }}/>
              ))}
            </div>
          </div>
          {/* info */}
          <div style={{ marginBottom:40 }}>
            <button style={{ marginRight:10, padding:'8px 16px' }}>
              Like: {palette.like_count||0}
            </button>
            <button style={{ padding:'8px 16px' }}>
              {dayjs(palette.created).fromNow()}
            </button>
          </div>
          {/* circles */}
          <div style={{ display:'flex', justifyContent:'center', gap:20 }}>
            {colorKeys.map((k,i)=>{
              const hex = palette[k];
              return (
                <div key={i} style={{ textAlign:'center' }}>
                  <div style={{
                    width:60, height:60, borderRadius:'50%',
                    backgroundColor:hex, margin:'0 auto'
                  }}/>
                  <hr style={{ margin:'12px auto', width:'60%' }}/>
                  <CopyableText text={hex.toUpperCase()}/>
                  <hr style={{ margin:'8px auto', width:'60%' }}/>
                  <CopyableText text={hexToRgb(hex)}/>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:20 }}>
            <Link to="/">Back to Palette List</Link>
          </div>
        </div>
        {/* 사이드바 */}
        <div style={{
          width:100, padding:20, borderLeft:'1px solid #ddd', textAlign:'center'
        }}>
          <button
            onClick={handleCollection}
            disabled={saved||busy}
            style={{
              display:'block', width:'100%', marginBottom:10, padding:8,
              background: saved ? '#999' : '#2196F3',
              color:'#fff', border:'none', borderRadius:4,
              cursor: (saved||busy)?'default':'pointer'
            }}
          >
            { busy ? '저장 중…' : (saved ? '저장됨' : '컬렉션') }
          </button>
          {isAuthor && <>
            <button onClick={handleEdit} style={{
              display:'block', width:'100%', marginBottom:10, padding:8,
              background:'#4CAF50', color:'#fff',
              border:'none', borderRadius:4, cursor:'pointer'
            }}>수정</button>
            <button onClick={handleDelete} style={{
              display:'block', width:'100%', padding:8,
              background:'#f44336', color:'#fff',
              border:'none', borderRadius:4, cursor:'pointer'
            }}>삭제</button>
          </>}
        </div>
      </div>
    </div>
  );
}
