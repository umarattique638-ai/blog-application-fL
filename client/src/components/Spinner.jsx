import React from 'react';

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div
        className="w-14 h-14 rounded-full border-4 border-t-4 border-violet-500 border-t-transparent animate-spin shadow-md"
        style={{
          borderColor: 'transparent',
          borderTopColor: '#8b5cf6',    // violet-500
          borderRightColor: '#a78bfa',  // violet-400
          borderBottomColor: '#7c3aed', // violet-600
          borderLeftColor: '#8b5cf6',   // violet-500
        }
        }
      />
    </div >
  );
}


export default Spinner;
