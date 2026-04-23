import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { resolveImageUrl } from '../lib/api';

const AvatarImage = ({ src, alt, size = 24, style, imgStyle, iconSize = 16, borderRadius = 12 }) => {
  const [hasError, setHasError] = useState(false);
  const showImage = src && !hasError;

  return showImage ? (
    <img
      src={resolveImageUrl(src)}
      alt={alt}
      onError={() => setHasError(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', ...imgStyle }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        overflow: 'hidden',
        background: 'linear-gradient(135deg,#06b6d4,#7c3aed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <GraduationCap size={iconSize} color="white" />
    </div>
  );
};

export default AvatarImage;
