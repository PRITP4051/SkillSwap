import React from 'react';
import { X } from 'lucide-react';

const SkillTag = ({ skill, onRemove, variant = 'teal' }) => (
  <span
    className={variant === 'violet' ? 'skill-tag skill-tag-violet' : 'skill-tag'}
    style={{ cursor: onRemove ? 'default' : 'default' }}
  >
    {skill}
    {onRemove && (
      <button
        onClick={() => onRemove(skill)}
        style={{ background:'none', border:'none', cursor:'pointer', padding:'0 0 0 2px',
          display:'flex', alignItems:'center', color:'inherit', opacity:0.7 }}
      >
        <X size={10} />
      </button>
    )}
  </span>
);

export default SkillTag;
