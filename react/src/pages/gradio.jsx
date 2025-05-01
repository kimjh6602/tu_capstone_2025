// GradioEmbed.jsx
import React from 'react';

function GradioEmbed() {
  return (
    <div style={{ width: '100%', height: '800px' }}>
      <iframe
        src="http://localhost:7860/"
        width="100%"
        height="100%"
        frameBorder="0"
        title="ClothingGAN"
        style={{ borderRadius: "8px" }}
      />
    </div>
  );
}

export default GradioEmbed;
