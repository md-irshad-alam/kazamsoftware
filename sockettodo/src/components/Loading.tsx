import React from "react";

const LoadingUI = () => {
  return (
    <div className="w-full  bg-white absolute top-0 bottom-0 sm:bottom-0  left-0 right-0 flex items-center justify-center">
      <div className="lg:w-[30vw] sm:w-[80%] p-2 mx-auto  rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 p-4 flex items-center justify-center gap-x-2">
          <h1 className="text-black text-3xl font-bold">Note App</h1>
        </div>
        <div className="p-4 ">
          <h2 className="text-lg font-semibold text-black mb-3 text-left">
            Notes
          </h2>
          <ul className="space-y-2 overflow-auto max-h-[50vh] custom-scroll">
            <li className="p-3 bg-gray-50 text-black rounded hover:bg-gray-400 cursor-pointer transition border-b-1 text-center text-3xl">
              Loading...
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoadingUI;
