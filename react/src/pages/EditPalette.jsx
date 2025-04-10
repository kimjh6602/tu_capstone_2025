import React, { useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";

const EditPalette = () => {
  const { id } = useParams(); // URL에서 팔레트 id를 가져옴
  const location = useLocation();
  const navigate = useNavigate();
  // 전달된 state에서 colors 배열을 추출하고, 없으면 기본 색상 배열 사용
  const initialColors =
    (location.state && location.state.colors) || ["#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE"];
  const [colors, setColors] = useState(initialColors);
  const palette_id = location.state.id;
  const inputRefs = useRef([]);

  // 색상 변경 핸들러: 입력 요소 변경 시 colors 배열 업데이트
  const handleColorChange = (index, newColor) => {
    setColors((prevColors) => {
      const newColors = [...prevColors];
      newColors[index] = newColor;
      return newColors;
    });
  };

  // 색상 블록 클릭 시 숨겨진 input[type="color"]를 클릭하게 함
  const handleBlockClick = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].click();
    }
  };

  // Save Changes 버튼 클릭 시, PATCH 요청을 통해 수정된 색상 정보를 백엔드에 전송
  const handleUpdate = () => {
    axiosInstance
      .patch(`/palette/api/detail/`, { colors,palette_id })
      .then((response) => {
        console.log("Palette updated", response.data);
        navigate("/catalog/");
      })
      .catch((error) => {
        console.error("Error updating palette via PATCH:", error);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Palette</h1>

      {/* 색상 선택 영역 */}
      <div style={styles.palette}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              ...styles.colorBlock,
              backgroundColor: color,
              cursor: "pointer"
            }}
            onClick={() => handleBlockClick(index)}
          >
            <span style={styles.colorText}>{color}</span>
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              ref={(el) => (inputRefs.current[index] = el)}
              style={styles.hiddenColorPicker}
            />
          </div>
        ))}
      </div>

      <button style={styles.createButton} onClick={handleUpdate}>
        Save Changes
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    marginTop: "2rem",
    textAlign: "center",
  },
  heading: {
    marginBottom: "1rem",
    fontSize: "2rem",
  },
  // 미리보기 카드 스타일 (이 예제에서는 생략됨; 필요 시 추가 가능)
  palette: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "2rem",
    marginBottom: "1rem",
  },
  colorBlock: {
    width: "30%",
    height: "50px",
    margin: "0",
    position: "relative",
    borderRadius: "5px",
    overflow: "hidden",
    cursor: "pointer",
  },
  colorText: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    padding: "2px 5px",
    borderRadius: "3px",
    fontSize: "12px",
  },
  hiddenColorPicker: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
    width: "100%",
    height: "100%",
  },
  createButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "1rem",
  },
};

export default EditPalette;
