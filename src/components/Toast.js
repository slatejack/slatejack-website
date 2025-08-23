import React, { forwardRef } from 'react';

const Toast = forwardRef((props, ref) => {
  return (
    <div 
      ref={ref}
      id="toast" 
      className="fixed top-6 right-6 bg-github-green text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full opacity-0 invisible transition-all duration-300 z-50"
    >
      <span id="toastMessage"></span>
    </div>
  );
});

export default Toast;