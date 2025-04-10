import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";

const CreatePalette = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState([
    "#BBBBBB",
    "#CCCCCC",
    "#DDDDDD",
    "#EEEEEE"
  ]);
  const inputRefs = useRef([]);

  const handleColorChange = (index, newColor) => {
    setColors(prevColors => {
      const newColors = [...prevColors];
      newColors[index] = newColor;
      return newColors;
    });
  };

  const handleBlockClick = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].click();
    }
  };

 const handleCreate = () => {
  axiosInstance.post('/palette/api/create/', { colors })
  .then(response => {
    console.log("Palette saved!", response.data);
    navigate('/catalog/')
  })
  .catch(error => {
    console.error("Error saving palette:", error);
  });
};
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create a Palette</h1>
      <div style={styles.palette}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              ...styles.colorBlock,
              backgroundColor: color,
              cursor: 'pointer'
            }}
            onClick={() => handleBlockClick(index)}
          >
            <span style={styles.colorText}>{color}</span>
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              ref={(el) => inputRefs.current[index] = el}
              style={styles.hiddenColorPicker}
            />
          </div>
        ))}
      </div>
      <button style={styles.createButton} onClick={handleCreate}>Create</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    marginTop: '2rem',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '2rem',
  },
  palette: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  colorBlock: {
    width: '30%',
    height: '50px',
    margin: '0',
    position: 'relative',
    borderRadius: '5px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  colorText: {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    padding: '2px 5px',
    borderRadius: '3px',
    fontSize: '12px',
  },
  hiddenColorPicker: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
  },
  createButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};

export default CreatePalette;
