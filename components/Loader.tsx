// components/Loader.js
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen fixed z-50 w-full">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>
  );
};

export default Loader;
