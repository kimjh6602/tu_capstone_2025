import React from 'react';
import './ColorBlock.css';

const ColorBlock = ({ colorCode }) => {
  return (
    <div className="color-block" style={{ backgroundColor: colorCode }}>
      <div className="overlay">{colorCode}</div>
    </div>
  );
};

export default ColorBlock;
