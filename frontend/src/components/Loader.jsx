import React from 'react'
import { Spin } from 'antd'

const Loader = () => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default Loader