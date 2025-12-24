import React from 'react';


const BakgrunnElementer = ({
  position = '-bottom-6 -right-6',
  size = 'text-4xl',
  content = '••••', 
  color= 'text-red-600',// default innhold
}) => {
  return (
    <div
      className={`absolute ${position} ${size} ${color}  opacity-20 select-none`}
      aria-hidden="true"
    >
      {content}
    </div>
  );
};

export default BakgrunnElementer;